// handles task CRUD on the dashboard

document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // kick to login if no token
  if (!token) {
    window.location.href = "/index.html";
    return;
  }

  // show user info
  document.getElementById("user-name").textContent = user.name || "User";
  document.getElementById("user-role").textContent = user.role || "user";

  const logoutBtn = document.getElementById("logout-btn");
  const taskForm = document.getElementById("task-form");
  const taskList = document.getElementById("task-list");
  const formTitle = document.getElementById("form-title");
  const cancelBtn = document.getElementById("cancel-edit");
  const dashMessage = document.getElementById("dash-message");

  let editingTaskId = null;

  // common headers for api calls
  const authHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  });

  // logout
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/index.html";
  });

  // load tasks on page open
  loadTasks();

  // form submit — create or update
  taskForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const taskData = {
      title: document.getElementById("task-title").value.trim(),
      description: document.getElementById("task-desc").value.trim(),
      status: document.getElementById("task-status").value,
      priority: document.getElementById("task-priority").value,
    };

    if (!taskData.title) {
      showDashMessage("Title is required", "error");
      return;
    }

    try {
      let res;
      if (editingTaskId) {
        res = await fetch(`${API_BASE}/tasks/${editingTaskId}`, {
          method: "PUT",
          headers: authHeaders(),
          body: JSON.stringify(taskData),
        });
      } else {
        res = await fetch(`${API_BASE}/tasks`, {
          method: "POST",
          headers: authHeaders(),
          body: JSON.stringify(taskData),
        });
      }

      const data = await res.json();

      if (data.success) {
        showDashMessage(
          editingTaskId ? "Task updated" : "Task created",
          "success"
        );
        resetForm();
        loadTasks();
      } else {
        showDashMessage(data.message || "Something went wrong", "error");
      }
    } catch (err) {
      showDashMessage("Network error", "error");
    }
  });

  // cancel editing
  cancelBtn.addEventListener("click", () => {
    resetForm();
  });

  // fetch and render all tasks
  async function loadTasks() {
    try {
      const res = await fetch(`${API_BASE}/tasks`, {
        headers: authHeaders(),
      });
      const data = await res.json();

      if (data.success) {
        renderTasks(data.tasks);
      } else if (res.status === 401) {
        // token expired
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/index.html";
      }
    } catch (err) {
      taskList.innerHTML =
        '<p class="empty-state">Failed to load tasks. Is the server running?</p>';
    }
  }

  function renderTasks(tasks) {
    if (tasks.length === 0) {
      taskList.innerHTML =
        '<p class="empty-state">No tasks yet. Create one above!</p>';
      return;
    }

    taskList.innerHTML = tasks
      .map(
        (task) => `
      <div class="task-card" data-id="${task.id}">
        <div class="task-header">
          <h3 class="task-title">${escapeHtml(task.title)}</h3>
          <div class="task-actions">
            <button class="btn-icon edit-btn" onclick="editTask('${task.id}')" title="Edit">✏️</button>
            <button class="btn-icon delete-btn" onclick="deleteTask('${task.id}')" title="Delete">🗑️</button>
          </div>
        </div>
        ${task.description ? `<p class="task-description">${escapeHtml(task.description)}</p>` : ""}
        <div class="task-meta">
          <span class="badge status-${task.status}">${task.status}</span>
          <span class="badge priority-${task.priority}">${task.priority}</span>
        </div>
      </div>
    `
      )
      .join("");
  }

  // edit — fill form with task data
  window.editTask = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/tasks/${id}`, {
        headers: authHeaders(),
      });
      const data = await res.json();

      if (data.success) {
        const task = data.task;
        document.getElementById("task-title").value = task.title;
        document.getElementById("task-desc").value = task.description || "";
        document.getElementById("task-status").value = task.status;
        document.getElementById("task-priority").value = task.priority;
        editingTaskId = id;
        formTitle.textContent = "Edit Task";
        cancelBtn.classList.remove("hidden");
        // scroll to form
        taskForm.scrollIntoView({ behavior: "smooth" });
      }
    } catch (err) {
      showDashMessage("Failed to load task details", "error");
    }
  };

  // delete task
  window.deleteTask = async (id) => {
    if (!confirm("Delete this task?")) return;

    try {
      const res = await fetch(`${API_BASE}/tasks/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      const data = await res.json();

      if (data.success) {
        showDashMessage("Task deleted", "success");
        loadTasks();
      } else {
        showDashMessage(data.message || "Failed to delete", "error");
      }
    } catch (err) {
      showDashMessage("Network error", "error");
    }
  };

  function resetForm() {
    taskForm.reset();
    editingTaskId = null;
    formTitle.textContent = "Create Task";
    cancelBtn.classList.add("hidden");
  }

  function showDashMessage(text, type) {
    dashMessage.textContent = text;
    dashMessage.className = `message ${type}`;
    dashMessage.classList.remove("hidden");
    setTimeout(() => {
      dashMessage.classList.add("hidden");
    }, 3000);
  }

  // basic xss prevention
  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }
});
