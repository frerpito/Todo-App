const express = require("express");

const router = express.Router();

const db = require("../database/db");



router.get("/", (req, res) => {
  db.all("SELECT * FROM tasks", [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message})
    }

    res.json(rows);
  })
});

router.post("/", (req, res) =>{
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

router.delete("/:id", (req, res) => {
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
        message: "Tarefa deletada"
      });
    }
  );
});

router.patch("/:id", (req, res) => {

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

module.exports = router;