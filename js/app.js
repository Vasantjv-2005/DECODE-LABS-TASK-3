// js/app.js

/**
 * INTERACTIVE EXPERIENCE HUB - MAIN CORE SCRIPT
 * Organizes state, modules, and micro-interactions in a clean, self-contained structure.
 */

// ==========================================
// 1. STATE MANAGER (Observable Pattern)
// ==========================================
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

  subscribe(key, callback) {
    if (!this.listeners[key]) {
      this.listeners[key] = [];
    }
    this.listeners[key].push(callback);
    
    // Fire callback immediately with current value
    callback(this.state[key]);
    
    return () => {
      this.listeners[key] = this.listeners[key].filter(cb => cb !== callback);
    };
  }

  set(key, value) {
    this.state[key] = value;
    
    if (key === 'tasks') {
      localStorage.setItem('tasks', JSON.stringify(value));
    } else if (key === 'theme') {
      localStorage.setItem('theme-mode', value);
    } else if (key === 'accent') {
      localStorage.setItem('theme-accent', value);
    }

    if (this.listeners[key]) {
      this.listeners[key].forEach(callback => callback(value));
    }
  }

  get(key) {
    return this.state[key];
  }
}

const state = new GlobalState();

// ==========================================
// 2. THEME MODULE (Mode and Accents)
// ==========================================
function initTheme() {
  const toggleBtn = document.getElementById('theme-toggle-btn');
  const navToggleBtn = document.getElementById('nav-theme-toggle-btn');
  const accentButtons = document.querySelectorAll('.theme-opt-btn');

  // Dark/Light toggle state
  state.subscribe('theme', (theme) => {
    if (theme === 'light') {
      document.body.classList.add('light-theme');
    } else {
      document.body.classList.remove('light-theme');
    }

    // Update floating switch icon
    const themeIcon = document.querySelector('#floating-theme-btn svg');
    if (themeIcon) {
      if (theme === 'light') {
        themeIcon.innerHTML = '<path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-11.314l.707.707m11.314 11.314l.707.707M12 8a4 4 0 100 8 4 4 0 000-8z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>';
      } else {
        themeIcon.innerHTML = '<path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>';
      }
    }
  });

  const handleToggle = () => {
    const currentTheme = state.get('theme');
    state.set('theme', currentTheme === 'dark' ? 'light' : 'dark');
  };

  if (toggleBtn) toggleBtn.addEventListener('click', handleToggle);
  if (navToggleBtn) navToggleBtn.addEventListener('click', handleToggle);

  // Accent Switcher state
  state.subscribe('accent', (accent) => {
    document.body.classList.remove('theme-blue', 'theme-violet', 'theme-cyan');
    document.body.classList.add(`theme-${accent}`);

    accentButtons.forEach(btn => {
      if (btn.classList.contains(`opt-${accent}`)) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Update cursor colors
    const cursor = document.getElementById('custom-cursor');
    const cursorDot = document.getElementById('custom-cursor-dot');
    if (cursor && cursorDot) {
      let color = '#8b5cf6';
      if (accent === 'blue') color = '#3b82f6';
      if (accent === 'cyan') color = '#06b6d4';
      cursor.style.borderColor = color;
      cursorDot.style.backgroundColor = color;
    }
  });

  accentButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.classList.contains('opt-blue')) state.set('accent', 'blue');
      if (btn.classList.contains('opt-violet')) state.set('accent', 'violet');
      if (btn.classList.contains('opt-cyan')) state.set('accent', 'cyan');
    });
  });
}

// ==========================================
// 3. COUNTER MODULE
// ==========================================
function initCounter() {
  const counterVal = document.getElementById('counter-value');
  const btnInc = document.getElementById('counter-inc');
  const btnDec = document.getElementById('counter-dec');
  const btnReset = document.getElementById('counter-reset');

  if (!counterVal) return;

  let count = 0;

  const updateCounter = (newValue) => {
    count = newValue;
    counterVal.textContent = count;
    
    counterVal.classList.remove('bump');
    void counterVal.offsetWidth; // force redraw
    counterVal.classList.add('bump');
  };

  counterVal.addEventListener('animationend', () => {
    counterVal.classList.remove('bump');
  });

  if (btnInc) btnInc.addEventListener('click', () => updateCounter(count + 1));
  if (btnDec) btnDec.addEventListener('click', () => updateCounter(count - 1));
  if (btnReset) btnReset.addEventListener('click', () => updateCounter(0));
}

// ==========================================
// 4. CHARACTER COUNTER MODULE
// ==========================================
function initCharCounter() {
  const textarea = document.getElementById('char-textarea');
  const charCountEl = document.getElementById('char-count');
  const wordCountEl = document.getElementById('word-count');
  const progressFill = document.getElementById('char-progress-fill');
  
  if (!textarea || !charCountEl || !wordCountEl || !progressFill) return;

  const maxLength = 280;

  const updateCounts = () => {
    const text = textarea.value;
    const charCount = text.length;
    
    charCountEl.textContent = charCount;

    const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
    wordCountEl.textContent = words;

    const percentage = Math.min((charCount / maxLength) * 100, 100);
    const offset = 100 - percentage;
    progressFill.style.strokeDashoffset = offset;

    progressFill.classList.remove('warning', 'danger');
    if (charCount >= maxLength) {
      progressFill.classList.add('danger');
    } else if (charCount >= maxLength * 0.8) {
      progressFill.classList.add('warning');
    }
  };

  textarea.addEventListener('input', updateCounts);
  updateCounts();
}

// ==========================================
// 5. QUOTE GENERATOR MODULE
// ==========================================
const quotes = [
  { text: "Make it simple, but significant.", author: "Don Draper" },
  { text: "Simplicity is the ultimate sophistication.", author: "Leonardo da Vinci" },
  { text: "Design is not just what it looks like and feels like. Design is how it works.", author: "Steve Jobs" },
  { text: "Details are not the details. They make the design.", author: "Charles Eames" },
  { text: "Good design is as little design as possible.", author: "Dieter Rams" },
  { text: "Digital design is like painting, except the paint is never dry.", author: "Neville Brody" },
  { text: "Simplicity is about subtracting the obvious and adding the meaningful.", author: "John Maeda" },
  { text: "A user interface is like a joke. If you have to explain it, it’s not that good.", author: "Martin Leblanc" }
];

function initQuoteGenerator() {
  const quoteText = document.getElementById('quote-text');
  const quoteAuthor = document.getElementById('quote-author');
  const generateBtn = document.getElementById('quote-generate-btn');

  if (!quoteText || !quoteAuthor || !generateBtn) return;

  let currentIdx = -1;

  const getNewQuote = () => {
    let newIdx;
    do {
      newIdx = Math.floor(Math.random() * quotes.length);
    } while (newIdx === currentIdx);
    
    currentIdx = newIdx;
    const quote = quotes[currentIdx];

    quoteText.classList.add('fade');
    quoteAuthor.classList.add('fade');

    setTimeout(() => {
      quoteText.textContent = `“${quote.text}”`;
      quoteAuthor.textContent = `— ${quote.author}`;
      quoteText.classList.remove('fade');
      quoteAuthor.classList.remove('fade');
    }, 250);
  };

  generateBtn.addEventListener('click', getNewQuote);
  getNewQuote();
}

// ==========================================
// 6. TASK MANAGER MODULE
// ==========================================
function initTaskManager() {
  const taskInput = document.getElementById('task-input');
  const taskAddBtn = document.getElementById('task-add-btn');
  const taskList = document.getElementById('task-list');
  const emptyState = document.getElementById('task-empty-state');
  const countCompleted = document.getElementById('task-count-completed');
  const countTotal = document.getElementById('task-count-total');

  if (!taskInput || !taskAddBtn || !taskList || !emptyState) return;

  const renderTasks = (tasks) => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    
    if (countTotal) countTotal.textContent = total;
    if (countCompleted) countCompleted.textContent = completed;

    if (total === 0) {
      emptyState.style.display = 'flex';
      taskList.style.display = 'none';
      return;
    } else {
      emptyState.style.display = 'none';
      taskList.style.display = 'flex';
    }

    // Clear removed items
    Array.from(taskList.children).forEach(child => {
      const childId = parseInt(child.dataset.id);
      if (!tasks.some(t => t.id === childId)) {
        child.remove();
      }
    });

    // Sync elements
    tasks.forEach((task) => {
      let taskItem = taskList.querySelector(`[data-id="${task.id}"]`);
      
      if (!taskItem) {
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

        taskItem.querySelector('.task-item-content').addEventListener('click', () => {
          toggleTaskStatus(task.id);
        });

        taskItem.querySelector('.task-delete-btn').addEventListener('click', (e) => {
          e.stopPropagation();
          deleteTaskWithAnimation(task.id, taskItem);
        });

        taskItem.addEventListener('animationend', () => {
          taskItem.classList.remove('adding');
        });

        taskList.appendChild(taskItem);
      }

      taskItem.querySelector('.task-text').textContent = task.text;
      if (task.completed) {
        taskItem.classList.add('completed');
      } else {
        taskItem.classList.remove('completed');
      }
    });
  };

  const toggleTaskStatus = (id) => {
    const currentTasks = state.get('tasks');
    const updatedTasks = currentTasks.map(t => 
      t.id === id ? { ...t, completed: !t.completed } : t
    );
    state.set('tasks', updatedTasks);
  };

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
    
    taskInput.value = '';
    taskInput.focus();
  };

  const deleteTaskWithAnimation = (id, element) => {
    element.classList.add('removing');
    
    element.addEventListener('transitionend', () => {
      const currentTasks = state.get('tasks');
      const filteredTasks = currentTasks.filter(t => t.id !== id);
      state.set('tasks', filteredTasks);
    });
    
    setTimeout(() => {
      if (document.body.contains(element)) {
        const currentTasks = state.get('tasks');
        const filteredTasks = currentTasks.filter(t => t.id !== id);
        state.set('tasks', filteredTasks);
      }
    }, 400);
  };

  taskAddBtn.addEventListener('click', addNewTask);
  taskInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') addNewTask();
  });

  state.subscribe('tasks', renderTasks);
}

// ==========================================
// 7. IMAGE GALLERY MODULE (Lightbox + Filters)
// ==========================================
function initGallery() {
  const filterButtons = document.querySelectorAll('.gallery-filter-btn');
  const galleryCards = document.querySelectorAll('.gallery-card');
  const lightbox = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxTag = document.getElementById('lightbox-tag');

  if (galleryCards.length === 0) return;

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      const filterValue = button.getAttribute('data-filter');

      galleryCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        const isMatch = filterValue === 'all' || cardCategory === filterValue;

        if (isMatch) {
          card.style.display = 'block';
          void card.offsetWidth; // reflow
          card.style.opacity = '1';
          card.style.transform = 'scale(1)';
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.8)';
          setTimeout(() => {
            if (card.style.opacity === '0') {
              card.style.display = 'none';
            }
          }, 300);
        }
      });
    });
  });

  galleryCards.forEach(card => {
    card.addEventListener('click', () => {
      const img = card.querySelector('.gallery-card-img');
      const title = card.querySelector('.gallery-card-title').textContent;
      const tag = card.querySelector('.gallery-card-tag').textContent;

      if (!img || !lightbox || !lightboxImg) return;

      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt || title;
      if (lightboxTitle) lightboxTitle.textContent = title;
      if (lightboxTag) lightboxTag.textContent = tag;

      lightbox.classList.add('open');
    });
  });

  const closeLightbox = () => {
    if (lightbox) {
      lightbox.classList.remove('open');
      setTimeout(() => {
        if (!lightbox.classList.contains('open')) {
          lightboxImg.src = '';
        }
      }, 350);
    }
  };

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);

  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });
}

// ==========================================
// 8. ACCORDION FAQ MODULE
// ==========================================
function initAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const header = item.querySelector('.faq-header');
    const panel = item.querySelector('.faq-panel');

    if (!header || !panel) return;

    header.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Close other panels
      faqItems.forEach(otherItem => {
        if (otherItem !== item && otherItem.classList.contains('open')) {
          otherItem.classList.remove('open');
          const otherPanel = otherItem.querySelector('.faq-panel');
          if (otherPanel) otherPanel.style.maxHeight = '0';
        }
      });

      if (isOpen) {
        item.classList.remove('open');
        panel.style.maxHeight = '0';
      } else {
        item.classList.add('open');
        panel.style.maxHeight = panel.scrollHeight + 'px';
      }
    });
  });

  window.addEventListener('resize', () => {
    faqItems.forEach(item => {
      if (item.classList.contains('open')) {
        const panel = item.querySelector('.faq-panel');
        if (panel) panel.style.maxHeight = panel.scrollHeight + 'px';
      }
    });
  });
}

// ==========================================
// 9. TESTIMONIALS MODULE (Slider)
// ==========================================
function initTestimonials() {
  const track = document.getElementById('testimonials-track');
  const slides = document.querySelectorAll('.testimonial-slide');
  const prevBtn = document.getElementById('slider-prev');
  const nextBtn = document.getElementById('slider-next');
  const dotsContainer = document.getElementById('slider-dots');

  if (!track || slides.length === 0) return;

  const slidesCount = slides.length;
  let currentIndex = 0;
  let autoPlayTimer = null;
  const autoPlayDelay = 6000;

  dotsContainer.innerHTML = '';
  for (let i = 0; i < slidesCount; i++) {
    const dot = document.createElement('div');
    dot.className = `slider-dot ${i === 0 ? 'active' : ''}`;
    dot.addEventListener('click', () => {
      goToSlide(i);
      resetAutoPlay();
    });
    dotsContainer.appendChild(dot);
  }

  const dots = dotsContainer.querySelectorAll('.slider-dot');

  const goToSlide = (index) => {
    currentIndex = index;
    track.style.transform = `translateX(-${currentIndex * 100}%)`;

    dots.forEach((dot, idx) => {
      if (idx === currentIndex) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  };

  const nextSlide = () => {
    goToSlide((currentIndex + 1) % slidesCount);
  };

  const prevSlide = () => {
    goToSlide((currentIndex - 1 + slidesCount) % slidesCount);
  };

  if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); resetAutoPlay(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); resetAutoPlay(); });

  const startAutoPlay = () => {
    autoPlayTimer = setInterval(nextSlide, autoPlayDelay);
  };

  const stopAutoPlay = () => {
    if (autoPlayTimer) {
      clearInterval(autoPlayTimer);
      autoPlayTimer = null;
    }
  };

  const resetAutoPlay = () => {
    stopAutoPlay();
    startAutoPlay();
  };

  const sliderArea = document.querySelector('.testimonials-slider');
  if (sliderArea) {
    sliderArea.addEventListener('mouseenter', stopAutoPlay);
    sliderArea.addEventListener('mouseleave', startAutoPlay);
  }

  startAutoPlay();
}

// ==========================================
// 10. STATS MODULE (Count-up on scroll)
// ==========================================
function initStats() {
  const statsSection = document.getElementById('stats');
  const statNumbers = document.querySelectorAll('.stat-number');

  if (!statsSection || statNumbers.length === 0) return;

  const countUp = (element) => {
    const target = parseInt(element.getAttribute('data-target'), 10);
    const suffix = element.getAttribute('data-suffix') || '';
    const duration = 1500;
    let startTime = null;

    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const value = Math.floor(progress * target);
      element.textContent = value.toLocaleString() + suffix;

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        element.textContent = target.toLocaleString() + suffix;
      }
    };

    requestAnimationFrame(step);
  };

  const observerOptions = {
    root: null,
    threshold: 0.15
  };

  const statsObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        statNumbers.forEach(num => countUp(num));
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  statsObserver.observe(statsSection);
}

// ==========================================
// 11. FLOATING ACTION PANEL
// ==========================================
function initFloatingPanel() {
  const panel = document.getElementById('floating-panel');
  const scrollBtn = document.getElementById('floating-scroll-btn');
  const themeBtn = document.getElementById('floating-theme-btn');
  const ringFill = document.getElementById('scroll-ring-fill');

  if (!panel || !scrollBtn || !themeBtn || !ringFill) return;

  const handleScroll = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    
    const offset = 100 - scrollPercent;
    ringFill.style.strokeDashoffset = offset;

    if (scrollTop > 300) {
      panel.classList.add('visible');
    } else {
      panel.classList.remove('visible');
    }
  };

  window.addEventListener('scroll', handleScroll);
  handleScroll();

  scrollBtn.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  themeBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const currentTheme = state.get('theme');
    state.set('theme', currentTheme === 'dark' ? 'light' : 'dark');
  });
}

// ==========================================
// 12. BOOTSTRAP INITIALIZATION
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  // Initialize Submodules
  initTheme();
  initCounter();
  initCharCounter();
  initQuoteGenerator();
  initTaskManager();
  initGallery();
  initAccordion();
  initTestimonials();
  initStats();
  initFloatingPanel();

  // Custom Cursor Spring Easing
  const cursor = document.getElementById('custom-cursor');
  const cursorDot = document.getElementById('custom-cursor-dot');
  
  if (cursor && cursorDot) {
    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    let hasMoved = false;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      
      if (!hasMoved) {
        cursor.style.opacity = '1';
        cursorDot.style.opacity = '1';
        hasMoved = true;
      }

      cursorDot.style.left = `${mouseX}px`;
      cursorDot.style.top = `${mouseY}px`;
    });

    const tick = () => {
      cursorX += (mouseX - cursorX) * 0.15;
      cursorY += (mouseY - cursorY) * 0.15;

      cursor.style.left = `${cursorX}px`;
      cursor.style.top = `${cursorY}px`;

      requestAnimationFrame(tick);
    };
    tick();

    // Delegate hover reactions to active elements
    document.addEventListener('mouseover', (e) => {
      const target = e.target.closest('a, button, input, textarea, select, .gallery-card, .faq-header, .task-item-content, .slider-dot, .social-btn');
      if (target) {
        cursor.classList.add('hover');
      } else {
        cursor.classList.remove('hover');
      }
    });

    window.addEventListener('mousedown', () => cursor.classList.add('click'));
    window.addEventListener('mouseup', () => cursor.classList.remove('click'));
    
    document.addEventListener('mouseleave', () => {
      cursor.style.opacity = '0';
      cursorDot.style.opacity = '0';
      hasMoved = false;
    });
  }

  // Card Interactive 3D Glow Coordinate mapping
  const cards = document.querySelectorAll('.glass-card, .gallery-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });

  // Scroll Reveal Observer
  const reveals = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  reveals.forEach(el => revealObserver.observe(el));

  // Mobile navigation overlay triggers
  const menuToggle = document.getElementById('mobile-menu-toggle');
  const mobileNav = document.getElementById('mobile-nav');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (menuToggle && mobileNav) {
    const toggleMenu = () => {
      menuToggle.classList.toggle('open');
      mobileNav.classList.toggle('open');
      document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : 'auto';
    };

    menuToggle.addEventListener('click', toggleMenu);

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.classList.remove('open');
        mobileNav.classList.remove('open');
        document.body.style.overflow = 'auto';
      });
    });
  }

  // Active link scroll observer
  const sections = document.querySelectorAll('section, header');
  const navLinks = document.querySelectorAll('.nav-link');

  const navScrollHandler = () => {
    let scrollPos = window.scrollY + 200;

    sections.forEach(section => {
      if (section.id && scrollPos >= section.offsetTop && scrollPos < (section.offsetTop + section.offsetHeight)) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${section.id}`) {
            link.classList.add('active');
          }
        });
      }
    });
    
    const navbar = document.querySelector('.navbar');
    if (navbar) {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }
  };

  window.addEventListener('scroll', navScrollHandler);
  navScrollHandler();
});
