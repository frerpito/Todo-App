const express = require("express");

const router = express.Router();

const db = require("../database/db");



router.get("/", (req, res) => {
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

router.patch("/", (req, res) => {
  
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

module.exports = router;