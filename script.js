document.addEventListener("DOMContentLoaded", function () {
    // Cek apakah user sudah login
    if (localStorage.getItem("isLoggedIn") !== "true") {
      window.location.href = "login.html";
      return;
    }
  
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("userEmail");
    const fullName = localStorage.getItem("userName");
  
    // Validasi data login
    if (!userId || !token) {
      alert("Silakan login terlebih dahulu!");
      window.location.href = "login.html";
      return;
    }
  
    // Tampilkan email dan nama user jika elemen ada
    const fullNameEl = document.getElementById("userFullName");
  
    if (fullNameEl) fullNameEl.textContent = fullName;
  
    // Tampilkan todo
    loadTodos();
  });
  

let editIndex = null;
let currentTodos = [];

function getStorageKey() {
    const userId = localStorage.getItem("userId");
    return `todos_${userId}`;
}

function getPriorityLabel(priority) {
    switch (priority) {
        case "1": return "🔥 Now";
        case "2": return "⏰ Rush";
        case "3": return "🧠 Plan";
        default: return "";
    }
}

function addOrUpdateTodo() {
    const input = document.getElementById("todoInput");
    const priority = document.getElementById("priorityInput").value;
    const task = input.value.trim();
    if (task === "") return;

    if (editIndex !== null) {
        const li = document.querySelectorAll("#todoList li")[editIndex];
        li.querySelector("span").textContent = `${task} [${getPriorityLabel(priority)}]`;
        currentTodos[editIndex].task = task;
        currentTodos[editIndex].priority = priority;
        editIndex = null;
        document.getElementById("addButton").textContent = "Add";
    } else {
        const li = createTodoElement(task, false, priority);
        document.getElementById("todoList").appendChild(li);
        currentTodos.push({ task, completed: false, priority });
    }

    input.value = "";
    saveTodos();
    renderTodos();
    updateStats();
}

function createTodoElement(task, completed, priority) {
    const li = document.createElement("li");
    li.className = "flex items-center justify-between p-2 rounded todo-item";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = completed;
    checkbox.className = "mr-2";
    checkbox.addEventListener("change", function () {
        const text = li.querySelector("span");
        if (checkbox.checked) {
            text.classList.add("line-through", "text-gray-500");
        } else {
            text.classList.remove("line-through", "text-gray-500");
        }

        const index = Array.from(document.querySelectorAll("#todoList li")).indexOf(li);
        currentTodos[index].completed = checkbox.checked;
        saveTodos();
        updateStats();
    });

    const text = document.createElement("span");
    text.textContent = `${task} [${getPriorityLabel(priority)}]`;
    if (completed) {
        text.classList.add("line-through", "text-gray-500");
    }

    const buttonContainer = document.createElement("div");

    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.className = "bg-wave text-white px-3 py-1 rounded mr-2 hover:bg-ocean";
    editButton.addEventListener("click", function () {
        document.getElementById("todoInput").value = task;
        document.getElementById("priorityInput").value = priority;
        document.getElementById("addButton").textContent = "Update";
        editIndex = Array.from(li.parentNode.children).indexOf(li);
    });

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.className = "bg-deep-aqua text-white px-3 py-1 rounded hover:bg-ocean";
    deleteButton.addEventListener("click", function () {
        const index = Array.from(document.querySelectorAll("#todoList li")).indexOf(li);
        currentTodos.splice(index, 1);
        li.remove();
        saveTodos();
        updateStats();
    });

    buttonContainer.appendChild(editButton);
    buttonContainer.appendChild(deleteButton);
    li.appendChild(checkbox);
    li.appendChild(text);
    li.appendChild(buttonContainer);

    return li;
}

function saveTodos() {
    const storageKey = getStorageKey();
    localStorage.setItem(storageKey, JSON.stringify(currentTodos));
}

function loadTodos() {
    const storageKey = getStorageKey();
    currentTodos = JSON.parse(localStorage.getItem(storageKey)) || [];
    renderTodos();
    updateStats();
}

function renderTodos() {
    const todoList = document.getElementById("todoList");
    todoList.innerHTML = "";

    const sortedTodos = [...currentTodos].sort((a, b) => a.priority - b.priority);

    sortedTodos.forEach(({ task, completed, priority }) => {
        const li = createTodoElement(task, completed, priority);
        todoList.appendChild(li);
    });
}

function updateStats() {
    const total = currentTodos.length;
    const completed = currentTodos.filter(todo => todo.completed).length;
    const uncompleted = total - completed;
    document.getElementById("todoStats").textContent = `Complete: ${completed} | Uncomplete: ${uncompleted}`;
}

function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("isLoggedIn"); // ✅ penting!
    window.location.href = "login.html";
  }
  
  