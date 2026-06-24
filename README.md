# Interactive Experience Hub

A premium, modern SaaS landing page designed with **Apple, Stripe, and Linear** aesthetics, showcasing advanced DOM manipulation, centralized state management, responsive glassmorphism designs, and custom micro-interactions.

Designed with vanilla technologies: **HTML5, Vanilla CSS3, and ES6 JavaScript**.

---

## 🚀 Key Features

### 1. Centralized State Manager (Observable Pattern)
Instead of coupling user inputs directly to DOM changes, we built a custom `GlobalState` engine in [`js/state.js`](file:///j:/VASANT/DECODE-LABS-TASK-3/js/state.js) using the **Observable Pattern**. 
- Submodules dynamically subscribe to specific state keys (e.g. `tasks`, `theme`, `accent`).
- State setters automatically serialize changes to `localStorage` and trigger reactive render updates across all active view controllers.

### 2. High-Fidelity UI & Aesthetics
- **Mesh/Aurora Glows:** Floating ambient meshes (`.glow-blob`) that animate in the background using CSS keyframe transforms.
- **Glassmorphism Design:** Translucent cards with intense blur layers (`backdrop-filter`), fine double-borders, and drop-shadow definitions.
- **Magnetic Card-Glows:** Moving mouse pointer coordinates are translated into CSS custom variables (`--mouse-x`, `--mouse-y`) to projection-map radial neon light highlights on card edges.
- **Smoothed Custom Cursor:** A dual-pointer (outer ring + target dot) that uses linear interpolation (lerp) inside a high-speed `requestAnimationFrame` render loop to track mouse cursor positions with natural inertial spring easing.

### 3. Interactive Widgets Deck
- **Dark Mode Switch:** A custom-styled switch that toggles themes and updates configurations across the page.
- **Click Counter:** A clean value display that plays an elastic bounce/scale trigger on click updates.
- **Live Text Analyzer:** A text box that computes character length and word counts, updating a circular SVG progress ring's dashboard stroke offset.
- **Quote Deck:** A selector picking motivational quotes and applying cross-fade opacity shifts on generation.
- **Accent Customizer:** Instantly swaps the main color palette (Royal Blue, Violet, Neon Cyan) and adjusts glows across components.

### 4. Productivity Panel
- **Task Orchestrator:** A task manager supporting add/delete functions, checking/unchecking items, live progress meters, and dynamic empty-state animations. Deleted list items fade out and scale down before being removed from the DOM.
- **Image Portfolio:** Category filter buttons that dynamically slide/scale items out of layout grids and host a zoomable lightbox overlay.
- **Accordion FAQs:** Animated collapsible drawers calculating element `scrollHeight` to slide panels open smoothly on click events.
- **Client Slider:** A review slider supporting automatic carousel loops (which pause on mouse hovers) and pagination controls.

### 5. Utilities & Metrics
- **Dynamic Counters:** Scroll reveals that activate count-up animations once stats elements cross the viewport boundary (using `IntersectionObserver` & `requestAnimationFrame`).
- **Floating HUD Panel:** A widget overlay tracking page scrolling progress on a radial gauge, incorporating quick theme swaps and scroll-to-top controls.

---

## 📁 Repository Structure

```
j:/VASANT/DECODE-LABS-TASK-3/
├── index.html                  # Main landing page entry
├── css/
│   ├── main.css                # Aggregate stylesheet loader
│   ├── base.css                # Theme tokens, font configurations, and resets
│   ├── layout.css              # Structural frameworks, header, footer, background blobs
│   ├── components.css          # Styled widgets, buttons, modal overlay, and inputs
│   ├── animations.css          # Custom cursor, hover-glow equations, and transitions
│   └── themes.css              # Dark/Light overrides and accent palette parameters
├── js/
│   ├── app.js                  # Combined, offline-compatible script (file:// protocol)
│   ├── main.js                 # ES6 Module bootstrap entry point
│   ├── state.js                # Centralized Observable state manager
│   └── modules/                # Granular ES6 UI components
│       ├── theme.js            # Light/Dark and Accent selector controllers
│       ├── counter.js          # Click counter widget
│       ├── charCounter.js      # Text analyzer and SVG circle loader
│       ├── quoteGenerator.js   # Dynamic quote generator
│       ├── taskManager.js      # CRUD Task Orchestrator
│       ├── gallery.js          # Category filters and modal lightbox
│       ├── accordion.js        # Accordion FAQ toggle calculations
│       ├── testimonials.js     # Responsive client slider
│       ├── stats.js            # Scroll count-up observer
│       └── floatingPanel.js    # Floating scroll status indicator
└── README.md                   # Project documentation
```

---

## ⚡ Setup & Run Instructions

The workspace is configured to support **both** local double-click execution and static HTTP servers:

### Option A: Double-Click (Zero Setup)
Simply open the [`index.html`](file:///j:/VASANT/DECODE-LABS-TASK-3/index.html) file directly inside any browser.
- Uses [`js/app.js`](file:///j:/VASANT/DECODE-LABS-TASK-3/js/app.js) to load the JavaScript components, bypassing browser CORS blocks on `file://` protocols.

### Option B: Local Server (ES6 Module Mode)
If you want to run the modular ES6 files ([`js/main.js`](file:///j:/VASANT/DECODE-LABS-TASK-3/js/main.js)), start a local static server inside the root directory:
```bash
# Using Node http-server
npx http-server -p 8080

# Using Python
python -m http.server 8080
```
Then navigate to `http://localhost:8080` in your browser.
