// js/state.js

class GlobalState {
  constructor() {
    this.state = {
      theme: localStorage.getItem('theme-mode') || 'dark',
      accent: localStorage.getItem('theme-accent') || 'violet',
      tasks: JSON.parse(localStorage.getItem('tasks')) || [
        { id: 1, text: 'Design hero section micro-interactions', completed: true },
        { id: 2, text: 'Implement glassmorphism state dashboard', completed: false },
        { id: 3, text: 'Benchmark scroll reveals with Intersection Observer', completed: false }
      ]
    };
    this.listeners = {};
  }

  // Subscribe to changes of a specific key
  subscribe(key, callback) {
    if (!this.listeners[key]) {
      this.listeners[key] = [];
    }
    this.listeners[key].push(callback);
    
    // Immediately fire callback with current value
    callback(this.state[key]);
    
    // Return unsubscribe function
    return () => {
      this.listeners[key] = this.listeners[key].filter(cb => cb !== callback);
    };
  }

  // Set state key and notify subscribers
  set(key, value) {
    this.state[key] = value;
    
    // Persist to local storage if necessary
    if (key === 'tasks') {
      localStorage.setItem('tasks', JSON.stringify(value));
    } else if (key === 'theme') {
      localStorage.setItem('theme-mode', value);
    } else if (key === 'accent') {
      localStorage.setItem('theme-accent', value);
    }

    // Trigger listeners
    if (this.listeners[key]) {
      this.listeners[key].forEach(callback => callback(value));
    }
  }

  // Get current state value
  get(key) {
    return this.state[key];
  }
}

const state = new GlobalState();
export default state;
