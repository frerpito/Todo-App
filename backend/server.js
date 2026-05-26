const express = require("express");
const sqlite3 = require ("sqlite3").verbose();
const cors = require("cors");

const app = express();

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
});



app.get("/", (req, res) => {
  res.send("API funcionando OOOH CARALHO!!!!");
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
    "INSERT INTO tasks (title) VALUES (?)",
    [title],
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

app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000 CARALHO!");
});