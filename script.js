document.addEventListener('DOMContentLoaded', loadTasks);

// Add new task
document.getElementById('task-form').addEventListener('submit', function (e) {
  e.preventDefault();

  const taskText = document.getElementById('task-input').value.trim();
  const taskDateTime = document.getElementById('task-datetime').value;
  const taskCategory = document.getElementById('task-category').value;

  if (!taskText || !taskDateTime || !taskCategory) {
    alert("Please fill in all fields.");
    return;
  }

  const task = {
    text: taskText,
    datetime: taskDateTime,
    category: taskCategory,
    completed: false
  };

  addTask(task);
  saveTask(task);

  this.reset();
});

function addTask(task) {
  const list = document.getElementById('task-list');
  const li = document.createElement('li');
  li.classList.add(task.category.toLowerCase());
  if (task.completed) li.classList.add('completed');

  const content = document.createElement('span');
  content.innerHTML = `${task.text} <small>(${new Date(task.datetime).toLocaleString()})</small> [${task.category}]`;
  li.appendChild(content);

  const actions = document.createElement('div');
  actions.classList.add('actions');

  // Complete
  const completeBtn = document.createElement('button');
  completeBtn.textContent = '✔';
  completeBtn.onclick = () => {
    task.completed = !task.completed;
    li.classList.toggle('completed');
    updateTaskInStorage(task);
  };

  // Edit
  const editBtn = document.createElement('button');
  editBtn.textContent = '✏️';
  editBtn.onclick = () => {
    const newText = prompt('Edit task:', task.text);
    if (newText) {
      task.text = newText.trim();
      content.innerHTML = `${task.text} <small>(${new Date(task.datetime).toLocaleString()})</small> [${task.category}]`;
      updateTaskInStorage(task);
    }
  };

  // Delete
  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = '🗑️';
  deleteBtn.onclick = () => {
    li.remove();
    removeFromLocalStorage(task);
  };

  actions.appendChild(completeBtn);
  actions.appendChild(editBtn);
  actions.appendChild(deleteBtn);

  li.appendChild(actions);
  list.appendChild(li);
}

function loadTasks() {
  const tasks = getTasksFromStorage();
  tasks.forEach(task => addTask(task));
}

function saveTask(task) {
  const tasks = getTasksFromStorage();
  tasks.push(task);
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function updateTaskInStorage(updatedTask) {
  let tasks = getTasksFromStorage();
  tasks = tasks.map(task => {
    if (task.text === updatedTask.text && task.datetime === updatedTask.datetime) {
      return updatedTask;
    }
    return task;
  });
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function removeFromLocalStorage(taskToRemove) {
  let tasks = getTasksFromStorage();
  tasks = tasks.filter(task =>
    !(task.text === taskToRemove.text && task.datetime === taskToRemove.datetime)
  );
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function getTasksFromStorage() {
  return JSON.parse(localStorage.getItem('tasks')) || [];
}

// Filter tasks by date
document.getElementById('date-filter').addEventListener('input', function (e) {
  const filterDate = e.target.value;
  const tasks = document.querySelectorAll('#task-list li');

  tasks.forEach(task => {
    const taskDate = task.querySelector('small').textContent.split(',')[0].replace(/[()]/g, '').trim();
    if (filterDate && !taskDate.includes(new Date(filterDate).toLocaleDateString())) {
      task.style.display = 'none';
    } else {
      task.style.display = 'flex';
    }
  });
});

// Clear all tasks
document.getElementById('clear-tasks-btn').addEventListener('click', function () {
  const confirmation = confirm("Are you sure you want to clear all tasks?");
  if (confirmation) {
    localStorage.removeItem('tasks');
    document.getElementById('task-list').innerHTML = '';
  }
});

// Toggle dark mode
document.getElementById('theme-toggle').addEventListener('click', function () {
  document.body.classList.toggle('dark-mode');

  // Optionally persist mode
  const isDark = document.body.classList.contains('dark-mode');
  localStorage.setItem('dark-mode', isDark ? 'enabled' : 'disabled');
});

// Restore dark mode on page load
if (localStorage.getItem('dark-mode') === 'enabled') {
  document.body.classList.add('dark-mode');
}
