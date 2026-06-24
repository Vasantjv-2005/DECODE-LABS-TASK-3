// js/main.js

import { initTheme } from './modules/theme.js';
import { initCounter } from './modules/counter.js';
import { initCharCounter } from './modules/charCounter.js';
import { initQuoteGenerator } from './modules/quoteGenerator.js';
import { initTaskManager } from './modules/taskManager.js';
import { initGallery } from './modules/gallery.js';
import { initAccordion } from './modules/accordion.js';
import { initTestimonials } from './modules/testimonials.js';
import { initStats } from './modules/stats.js';
import { initFloatingPanel } from './modules/floatingPanel.js';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize all modular elements
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

  // 2. Custom Cursor Follower with Inertia (Linear Interpolation)
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
      
      // Make cursor elements visible on first move
      if (!hasMoved) {
        cursor.style.opacity = '1';
        cursorDot.style.opacity = '1';
        hasMoved = true;
      }

      // Fast-track the tiny center dot
      cursorDot.style.left = `${mouseX}px`;
      cursorDot.style.top = `${mouseY}px`;
    });

    // Smooth lerp animation cycle
    const tick = () => {
      // 0.15 lerp factor for spring ease effect
      cursorX += (mouseX - cursorX) * 0.15;
      cursorY += (mouseY - cursorY) * 0.15;

      cursor.style.left = `${cursorX}px`;
      cursor.style.top = `${cursorY}px`;

      requestAnimationFrame(tick);
    };
    tick();

    // Event delegation for cursor hover states (handles dynamically added nodes too!)
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
    
    // Hide cursor if cursor leaves window
    document.addEventListener('mouseleave', () => {
      cursor.style.opacity = '0';
      cursorDot.style.opacity = '0';
      hasMoved = false;
    });
  }

  // 3. Card Light Refractions / Glow Tracking (Linear style)
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

  // 4. Scroll Reveal Intersection Observer
  const reveals = document.querySelectorAll('.reveal');
  const revealOptions = {
    root: null,
    threshold: 0.1, // Trigger when 10% is visible
    rootMargin: '0px 0px -50px 0px' // offset so triggers slightly before viewport
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Unobserve to run reveal animations once
        observer.unobserve(entry.target);
      }
    });
  }, revealOptions);

  reveals.forEach(el => revealObserver.observe(el));

  // 5. Mobile Navbar Menu Toggle
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
        // Close menu on link click
        menuToggle.classList.remove('open');
        mobileNav.classList.remove('open');
        document.body.style.overflow = 'auto';
      });
    });
  }

  // 6. Active Section scroll tracking for header navigation items
  const sections = document.querySelectorAll('section, header');
  const navLinks = document.querySelectorAll('.nav-link');

  const navScrollHandler = () => {
    let scrollPos = window.scrollY + 200; // offset

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
    
    // Add border shadow class on navbar once scrolled past top
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
  navScrollHandler(); // Run once initially
});
