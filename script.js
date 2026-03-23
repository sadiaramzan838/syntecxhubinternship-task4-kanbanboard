// Data
let tasks = [];

// Load from localStorage
function loadTasks() {
  const saved = localStorage.getItem("kanbanTasks");
  if (saved) {
    tasks = JSON.parse(saved);
  }
  renderAll();
}

// Save to localStorage
function saveTasks() {
  localStorage.setItem("kanbanTasks", JSON.stringify(tasks));
}

// Render all tasks
function renderAll() {
  document.querySelectorAll(".tasks").forEach(container => {
    container.innerHTML = "";
    const status = container.parentElement.dataset.status;

    tasks
      .filter(t => t.status === status)
      .forEach(task => {
        const div = document.createElement("div");
        div.className = "task";
        div.draggable = true;
        div.dataset.id = task.id;
        div.innerHTML = `
          <span>${task.text}</span>
          <button class="delete-btn">×</button>
        `;

        div.querySelector(".delete-btn").onclick = () => {
          if (confirm("Delete this task?")) {
            tasks = tasks.filter(t => t.id !== task.id);
            saveTasks();
            renderAll();
          }
        };

        container.appendChild(div);
      });
  });

  setupDragAndDrop();
}

// Drag & Drop setup
let draggedTask = null;

function setupDragAndDrop() {
  // Clean old listeners
  document.querySelectorAll(".task").forEach(task => {
    task.removeEventListener("dragstart", handleDragStart);
    task.removeEventListener("dragend", handleDragEnd);
  });

  document.querySelectorAll(".tasks").forEach(zone => {
    zone.removeEventListener("dragover", handleDragOver);
    zone.removeEventListener("drop", handleDrop);
  });

  // Add listeners
  document.querySelectorAll(".task").forEach(task => {
    task.addEventListener("dragstart", handleDragStart);
    task.addEventListener("dragend", handleDragEnd);
  });

  document.querySelectorAll(".tasks").forEach(zone => {
    zone.addEventListener("dragover", handleDragOver);
    zone.addEventListener("drop", handleDrop);
  });
}

function handleDragStart(e) {
  draggedTask = this;
  setTimeout(() => this.style.display = "none", 0);
  e.dataTransfer.effectAllowed = "move";
}

function handleDragEnd() {
  setTimeout(() => {
    if (draggedTask) draggedTask.style.display = "flex";
    draggedTask = null;
  }, 0);
}

function handleDragOver(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = "move";
}

function handleDrop(e) {
  e.preventDefault();
  if (!draggedTask) return;

  const newStatus = this.parentElement.dataset.status;
  const taskId = draggedTask.dataset.id;

  const task = tasks.find(t => t.id == taskId);
  if (task) {
    task.status = newStatus;
    saveTasks();
    renderAll();
  }
}

// Add new task
document.querySelectorAll(".add-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const text = prompt("Enter task:");
    if (!text?.trim()) return;

    const newTask = {
      id: Date.now(),
      text: text.trim(),
      status: btn.closest(".column").dataset.status
    };

    tasks.push(newTask);
    saveTasks();
    renderAll();
  });
});

// Start
loadTasks();