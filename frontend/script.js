const API_URL = "http://localhost:3000/tasks";

const taskForm = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");
const taskList = document.getElementById("task-list");

async function loadTasks() {
  const response = await fetch(API_URL);

  const tasks = await response.json();

  taskList.innerHTML = "";

  tasks.forEach(task => {
    const li = document.createElement("li");

    const checkbox = document.createElement("input");

    checkbox.type = "checkbox";

    checkbox.checked = Boolean(task.done);

    checkbox.addEventListener("change", async () => {

      await fetch(`${API_URL}/${task.id}`, {
        method: "PATCH"
      });

      loadTasks();

    });

    const taskText = document.createTextNode(task.title);

    const deleteButton = document.createElement("button");

    deleteButton.textContent = "Excluir";

    deleteButton.addEventListener("click", async () => {
      await fetch(`${API_URL}/${task.id}`, {
        method: "DELETE"
      });

      loadTasks();
    });

    li.appendChild(checkbox);

    li.appendChild(taskText);

    li.appendChild(deleteButton);

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

loadTasks();