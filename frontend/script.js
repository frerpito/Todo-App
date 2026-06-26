const API_URL = "http://localhost:3000/tasks"; 

const taskForm = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");
const taskList = document.getElementById("task-list");
const notesArea = document.getElementById("notas-textarea");

async function loadTasks() {
  const response = await fetch(API_URL);

  const tasks = await response.json();

  taskList.innerHTML = "";

  tasks.forEach(task => {
    const li = document.createElement("li");
    li.classList.add(task.done ? "task-completa" : "task")

    // Div esquerda
    const leftContainer = document.createElement("div");
    leftContainer.classList.add("task-content")

    //Checkbox
    const checkbox = document.createElement("input");

    checkbox.type = "checkbox";
    checkbox.checked = Boolean(task.done);

    checkbox.addEventListener("change", async () => {
      await fetch(`${API_URL}/${task.id}`, {
        method: "PATCH"
      });
      loadTasks();
    });

    //Texto
    const taskText = document.createElement("span");
    taskText.textContent = task.title;

    //Botão Excluir
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Excluir";
    deleteButton.id = "delete-button"

    deleteButton.addEventListener("click", async () => {
      await fetch(`${API_URL}/${task.id}`, {
        method: "DELETE"
      });
      loadTasks();
    });

    //Montando estrutura do container de cada item da lista
    li.appendChild(leftContainer)

    leftContainer.appendChild(checkbox)
    leftContainer.appendChild(taskText)

    li.appendChild(deleteButton)

    taskList.appendChild(li);
  });
}

taskForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const title = taskInput.value;

  if (!title) return;

  await fetch(API_URL, {
    method: "POST",

    headers: {
      "Content-Type": "application/json"
    },

    body: JSON.stringify({
      title
    })
  });

  taskInput.value = "";

  loadTasks();
});



async function loadNotes (params) {

  const response = await fetch(
    "http://localhost:3000/notes"
  )

  const data = await response.json();

  notesArea.value = data.content;
  
}

let saveTimeout;

notesArea.addEventListener(
  "input", () => {

    clearTimeout(saveTimeout);
    
    saveTimeout = setTimeout(

      async() => {

        await fetch(
        "http://localhost:3000/notes",
        {

          method: "PATCH",
          headers:{
            "Content-Type":"application/json"
          },

          body: JSON.stringify({
            content: notesArea.value
          })

        }
      );

      console.log("Notas salvas");

      }, 2000
    );

  }
);

loadTasks();

loadNotes();