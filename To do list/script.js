document.addEventListener('DOMContentLoaded', () => {
  const taskInput = document.getElementById('taskInput');
  const addTaskBtn = document.getElementById('addTaskBtn');
  const taskList = document.getElementById('taskList');
  const taskCounter = document.getElementById('taskCounter');
  const errorMessage = document.getElementById('errorMessage');
  const clearCompletedBtn = document.getElementById('clearCompletedBtn');

  let tasks = [];
  let currentFilter = 'all';

  // Function to update the number of incomplete tasks
  function updateTaskCounter() {
    if (taskCounter) {
      const remainingCount = tasks.filter(task => !task.completed).length;
      taskCounter.textContent = `${remainingCount} remaining`;
    }
  }

  // Function to render tasks based on the active filter
  function renderTasks() {
    if (!taskList) return;
    taskList.innerHTML = '';

    const filteredTasks = tasks.filter(task => {
      if (currentFilter === 'active') return !task.completed;
      if (currentFilter === 'completed') return task.completed;
      return true; // 'all'
    });

    if (filteredTasks.length === 0) {
      let message = 'No tasks yet. Add your first task!';
      if (currentFilter === 'active') message = 'No active tasks found.';
      if (currentFilter === 'completed') message = 'No completed tasks found.';

      taskList.innerHTML = `
        <li class="list-group-item text-center text-muted border-0 py-4">
          ${message}
        </li>`;
      updateTaskCounter();
      return;
    }

    filteredTasks.forEach((task) => {
      const li = document.createElement('li');
      li.className = `list-group-item d-flex justify-content-between align-items-center ${task.completed ? 'task-completed bg-light' : ''}`;

      li.innerHTML = `
        <div class="d-flex align-items-center">
          <input class="form-check-input me-2 task-checkbox" type="checkbox" ${task.completed ? 'checked' : ''}>
          <span>${task.text}</span>
        </div>
        <button class="btn btn-outline-danger btn-sm delete-btn">Delete</button>
      `;

      // Toggle completion status
      const checkbox = li.querySelector('.task-checkbox');
      checkbox.addEventListener('change', () => {
        task.completed = checkbox.checked;
        renderTasks();
      });

      // Delete individual task
      const deleteBtn = li.querySelector('.delete-btn');
      deleteBtn.addEventListener('click', () => {
        tasks = tasks.filter(t => t.id !== task.id);
        renderTasks();
      });

      taskList.appendChild(li);
    });

    updateTaskCounter();
  }

  // Function to add a new task with validation
  function addNewTask() {
    if (!taskInput) return;
    const taskText = taskInput.value.trim();

    if (taskText === '') {
      if (errorMessage) errorMessage.classList.remove('d-none');
      taskInput.classList.add('is-invalid');
      taskInput.focus();
      return;
    }

    if (errorMessage) errorMessage.classList.add('d-none');
    taskInput.classList.remove('is-invalid');

    tasks.push({
      id: Date.now(),
      text: taskText,
      completed: false
    });

    taskInput.value = '';
    taskInput.focus();
    renderTasks();
  }

  // Event listener for Clear Completed button
  if (clearCompletedBtn) {
    clearCompletedBtn.addEventListener('click', () => {
      tasks = tasks.filter(task => !task.completed);
      renderTasks();
    });
  }

  // Event Listeners for Filter Radio Buttons (safely queried)
  const filterRadios = document.querySelectorAll('input[name="filterRadio"]');
  filterRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
      if (e.target.id === 'filterAll') currentFilter = 'all';
      if (e.target.id === 'filterActive') currentFilter = 'active';
      if (e.target.id === 'filterCompleted') currentFilter = 'completed';
      renderTasks();
    });
  });

  // Add Task Event Listeners
  if (addTaskBtn) {
    addTaskBtn.addEventListener('click', addNewTask);
  }
  if (taskInput) {
    taskInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') addNewTask();
    });
  }

  // Initial load
  renderTasks();
});