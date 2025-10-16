// === Select DOM Elements ===
const taskInput = document.getElementById("task-input");
const dueDateInput = document.getElementById("due-date");
const priorityInput = document.getElementById("priority");
const categoryInput = document.getElementById("category");
const addBtn = document.getElementById("add-btn");
const taskList = document.getElementById("task-list");
const darkToggle = document.getElementById("darkModeToggle");

// Modal elements
const editModal = document.getElementById("editModal");
const editText = document.getElementById("editText");
const editDueDate = document.getElementById("editDueDate");
const editPriority = document.getElementById("editPriority");
const editCategory = document.getElementById("editCategory");
const saveEditBtn = document.getElementById("saveEditBtn");
const cancelEditBtn = document.getElementById("cancelEditBtn");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let isDarkMode = localStorage.getItem("darkMode") === "true";
let currentEditIndex = null;

// === Initial setup ===
if (isDarkMode) document.body.classList.add("dark");
darkToggle.checked = isDarkMode;
renderTasks();

// === Add Task ===
addBtn.addEventListener("click", () => {
  const text = taskInput.value.trim();
  const due = dueDateInput.value;
  const priority = priorityInput.value;
  const category = categoryInput.value;

  if (text === "") return alert("Enter a task!");

  const newTask = { text, due, priority, category, completed: false };
  tasks.push(newTask);
  saveTasks();
  renderTasks();

  taskInput.value = "";
  dueDateInput.value = "";
});

// === Render Tasks ===
function renderTasks() {
  taskList.innerHTML = "";

  tasks.forEach((task, i) => {
    const li = document.createElement("li");
    if (task.completed) li.classList.add("completed");

    const info = document.createElement("div");
    info.classList.add("task-info");

    const title = document.createElement("span");
    title.textContent = task.text;
    title.classList.add("task-title");

    const meta = document.createElement("div");
    meta.classList.add("task-meta");
    meta.textContent = `${task.category} | Priority: ${task.priority} | Due: ${
      task.due || "No date"
    }`;

    info.append(title, meta);

    const actions = document.createElement("div");
    actions.classList.add("actions");

    const editBtn = document.createElement("button");
    editBtn.innerHTML = "✏️";
    editBtn.title = "Edit";
    editBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      openEditModal(i);
    });

    const completeBtn = document.createElement("button");
    completeBtn.innerHTML = task.completed ? "↩️" : "✅";
    completeBtn.title = task.completed ? "Mark as Incomplete" : "Mark as Complete";
    completeBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleTask(i);
    });

    const delBtn = document.createElement("button");
    delBtn.innerHTML = "🗑️";
    delBtn.title = "Delete";
    delBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      deleteTask(i);
    });

    actions.append(editBtn, completeBtn, delBtn);
    li.append(info, actions);
    taskList.appendChild(li);
  });
}

// === Toggle Complete ===
function toggleTask(index) {
  tasks[index].completed = !tasks[index].completed;
  saveTasks();
  renderTasks();
}

// === Delete Task ===
function deleteTask(index) {
  if (confirm("Delete this task?")) {
    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
  }
}

// === Edit Modal ===
function openEditModal(index) {
  const task = tasks[index];
  currentEditIndex = index;

  editText.value = task.text;
  editDueDate.value = task.due;
  editPriority.value = task.priority;
  editCategory.value = task.category;

  editModal.style.display = "flex";
}

cancelEditBtn.addEventListener("click", () => {
  editModal.style.display = "none";
});

saveEditBtn.addEventListener("click", () => {
  const i = currentEditIndex;
  tasks[i].text = editText.value.trim();
  tasks[i].due = editDueDate.value;
  tasks[i].priority = editPriority.value;
  tasks[i].category = editCategory.value;

  saveTasks();
  renderTasks();
  editModal.style.display = "none";
});

// === Close Modal on outside click ===
window.addEventListener("click", (e) => {
  if (e.target === editModal) {
    editModal.style.display = "none";
  }
});

// === Dark Mode Toggle ===
darkToggle.addEventListener("change", () => {
  document.body.classList.toggle("dark", darkToggle.checked);
  localStorage.setItem("darkMode", darkToggle.checked);
});

// === Save Tasks ===
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}
