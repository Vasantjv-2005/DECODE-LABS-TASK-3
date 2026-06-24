// js/modules/taskManager.js
import state from '../state.js';

export function initTaskManager() {
  const taskInput = document.getElementById('task-input');
  const taskAddBtn = document.getElementById('task-add-btn');
  const taskList = document.getElementById('task-list');
  const emptyState = document.getElementById('task-empty-state');
  const countCompleted = document.getElementById('task-count-completed');
  const countTotal = document.getElementById('task-count-total');

  if (!taskInput || !taskAddBtn || !taskList || !emptyState) return;

  // Render function that takes current tasks array and synchronizes the DOM
  const renderTasks = (tasks) => {
    // 1. Update stats count
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    
    if (countTotal) countTotal.textContent = total;
    if (countCompleted) countCompleted.textContent = completed;

    // 2. Handle empty state visibility
    if (total === 0) {
      emptyState.style.display = 'flex';
      taskList.style.display = 'none';
      return;
    } else {
      emptyState.style.display = 'none';
      taskList.style.display = 'flex';
    }

    // 3. Render tasks
    // To avoid rewriting elements that haven't changed, we can simple clear and build
    // but we want to make sure new items animate in.
    // We can do a differential render or simple render and flag new IDs.
    // For simplicity and premium visual fidelity, we track which ones are already in DOM.
    const existingDomIds = Array.from(taskList.children).map(child => parseInt(child.dataset.id));
    
    // Clear DOM that represents deleted items
    Array.from(taskList.children).forEach(child => {
      const childId = parseInt(child.dataset.id);
      if (!tasks.some(t => t.id === childId)) {
        child.remove();
      }
    });

    // Append or update remaining items
    tasks.forEach((task) => {
      let taskItem = taskList.querySelector(`[data-id="${task.id}"]`);
      
      if (!taskItem) {
        // Create new item
        taskItem = document.createElement('div');
        taskItem.className = 'task-item adding';
        taskItem.dataset.id = task.id;
        
        taskItem.innerHTML = `
          <div class="task-item-content">
            <div class="task-checkbox-custom">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            <span class="task-text"></span>
          </div>
          <button class="task-delete-btn" aria-label="Delete task">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
          </button>
        `;

        // Wire up clicks
        taskItem.querySelector('.task-item-content').addEventListener('click', () => {
          toggleTaskStatus(task.id);
        });

        taskItem.querySelector('.task-delete-btn').addEventListener('click', (e) => {
          e.stopPropagation();
          deleteTaskWithAnimation(task.id, taskItem);
        });

        // Strip animation class after play
        taskItem.addEventListener('animationend', () => {
          taskItem.classList.remove('adding');
        });

        taskList.appendChild(taskItem);
      }

      // Update contents & complete state class
      taskItem.querySelector('.task-text').textContent = task.text;
      if (task.completed) {
        taskItem.classList.add('completed');
      } else {
        taskItem.classList.remove('completed');
      }
    });
  };

  // Toggle state completed flag
  const toggleTaskStatus = (id) => {
    const currentTasks = state.get('tasks');
    const updatedTasks = currentTasks.map(t => 
      t.id === id ? { ...t, completed: !t.completed } : t
    );
    state.set('tasks', updatedTasks);
  };

  // Add task logic
  const addNewTask = () => {
    const text = taskInput.value.trim();
    if (text === '') return;

    const newTask = {
      id: Date.now(),
      text: text,
      completed: false
    };

    const currentTasks = state.get('tasks');
    state.set('tasks', [...currentTasks, newTask]);
    
    // Clear inputs
    taskInput.value = '';
    taskInput.focus();
  };

  // Smooth delete animation handler
  const deleteTaskWithAnimation = (id, element) => {
    element.classList.add('removing');
    
    // Wait for scaling/slide-out animations to end before updating state
    element.addEventListener('transitionend', () => {
      const currentTasks = state.get('tasks');
      const filteredTasks = currentTasks.filter(t => t.id !== id);
      state.set('tasks', filteredTasks);
    });
    
    // Safety timeout in case transitionend does not fire
    setTimeout(() => {
      if (document.body.contains(element)) {
        const currentTasks = state.get('tasks');
        const filteredTasks = currentTasks.filter(t => t.id !== id);
        state.set('tasks', filteredTasks);
      }
    }, 400);
  };

  // Wire up action inputs
  taskAddBtn.addEventListener('click', addNewTask);
  taskInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      addNewTask();
    }
  });

  // Subscribe to changes in global state tasks
  state.subscribe('tasks', renderTasks);
}
