const express = require ("express"); //importação de módulo para esse arquivo
const cors = require("cors");
const path = require("path");

const app = express(); //criando instância da aplicação express. É essa por meio dessa instância que a gente vai usar rotas HTTP. Ela é como um 'objeto' do tipo 'Express'

const taskRoutes = require("./routes/tasks");
const noteRoutes = require("./routes/notes");

require("./database/db"); //inicializando conxão com banco

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

app.use("/tasks", taskRoutes);
app.use("/notes", noteRoutes);

/*
app.get("/", (req, res) => {
  res.send("API funcionando!!!");
});
*/

app.listen(3000, "0.0.0.0", () => {
    console.log("Servidor rodando na porta 3000!");
});