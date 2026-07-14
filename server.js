const express = require("express"); //importação de módulo para esse arquivo
const sqlite3 = require ("sqlite3").verbose();
const cors = require("cors");

const app = express(); //criando instância da aplicação express. É essa por meio dessa instância que a gente vai usar rotas HTTP. Ela é como um 'objeto' do tipo 'Express'

app.use(cors());
app.use(express.json());

const db = new sqlite3.Database("./database/database.db");

db.serialize(() => {

  db.run(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT null,
      done INTEGER DEFAULT 0
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS notes(
      id INTEGER PRIMARY KEY,
      content TEXT
    )
  `);

});



app.get("/", (req, res) => {
  res.send("API funcionando!!!");
});

app.get("/tasks", (req, res) => {
  db.all("SELECT * FROM tasks", [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message})
    }

    res.json(rows);
  })
});

app.post("/tasks", (req, res) =>{
  const { title } = req.body;

  db.run(
    "INSERT INTO tasks (title, done) VALUES (?, ?)",
    [title, 0],
    function (err) {
      if (err) {
        return res.status(500).json({error: err.message });
      }

      res.status(201).json({
        id: this.lastID,
        title, 
        done: 0
      });
    }
  );
});

app.delete("/tasks/:id", (req, res) => {
  const { id } = req.params;

  db.run(
    "DELETE FROM tasks WHERE id = ?",
    [id],
    function (err) {
      if (err) {
        return res.status(500).json({
          error: err.message
        });
      }

      res.json({
        message: "Tarefa deleteada"
      });
    }
  );
});

app.patch("/tasks/:id", (req, res) => {

  const { id } = req.params;

  db.run(
    `
    UPDATE tasks
    SET done = NOT done
    WHERE id = ?
    `,
    [id],
    function(err) {

      if(err) {
        return res.status(500).json({
          error: err.message
        });
      }

      res.json({
        message: "Tarefa atualizada"
      });

    }
  );

});

app.get("/notes", (req, res) => {
  db.get(
    "SELECT content FROM notes WHERE id = 1",
    [],
    (err, row) => {
      
      if(err){
        return res.status(500).json({
          error: err.message
        });
      }

      res.json({
        content: row?.content || ""
      });
      
    }
  );

});

app.patch("/notes", (req, res) => {
  
  const {content} = req.body;

  db.run(
    `
    INSERT OR REPLACE INTO notes
    (id, content)

    VALUES(1, ?)    
    `,

    [content],

    function(err){
      if(err){
        return res.status(500).json({
          error: err.message
        });
      }

      res.json({
        message: "Nota salva"
      });

    }

  );

});

app.listen(3000, "0.0.0.0", () => {
    console.log("Servidor rodando na porta 3000!");
});