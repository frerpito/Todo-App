console.log("Abrindo conexão com o banco...");

const sqlite3 = require ("sqlite3").verbose();

const path = require("path");

const db = new sqlite3.Database(
    path.join(__dirname, "database.db")
);

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

module.exports = db;