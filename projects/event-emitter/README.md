# Global Message Bus for Decoupled Components

> A lightweight event-driven communication system for building decoupled UI components with a custom EventEmitter implementation.

## 🎯 About

This project demonstrates a clean, event-driven architecture for building decoupled UI components that communicate through a central message bus. Instead of tight coupling where components directly reference each other, all components interact through a shared event emitter, making the system more maintainable, testable, and scalable.

The implementation includes a fully-featured `EventEmitter` class with advanced capabilities like wildcard listeners, memory leak warnings, and error handling — inspired by Node.js EventEmitter — all in vanilla JavaScript with zero dependencies.

## ✨ Features

- **Event-Driven Architecture** — Components communicate via named events, eliminating direct dependencies
- **Decoupled Components** — Header, Sidebar, and Main components operate independently
- **Two Emitter Variants** — Basic `EventEmitter` and feature-rich `AdvancedEventEmitter`
- **Wildcard Listeners** — Catch-all `*` listeners for monitoring all events
- **Memory Leak Protection** — Configurable max listeners with warnings
- **Once Listeners** — Auto-removing one-time event handlers
- **Chaining Support** — Fluent API for registering multiple listeners
- **Error Handling** — Special handling for `error` events with automatic throwing when unhandled

## 🎯 What You'll Learn

- **Pub/Sub Pattern** — Publish-subscribe communication between independent modules
- **Event-Driven Design** — Building loosely coupled systems that scale
- **Custom Event Emitter** — Implementing a robust event system from scratch
- **Component-Based UI** — Structuring front-end code into reusable, self-contained components
- **State Management** — Managing user authentication state across decoupled components
- **JavaScript Classes** — Using ES6 classes, inheritance, and method chaining

## 🎮 How to Use

1. Clone or download the project files
2. Open `index.html` in your browser (no build tools required)
3. Interact with the components:
   - Click **Login** — emits an `auth:login` event with user data
   - Click **Logout** — emits an `auth:logout` event
   - Click **Toggle Dark Mode** — emits a `theme:change` event
4. Watch how components react to events without knowing about each other

### Example: Emitting and Listening

```js
import { AdvancedEventEmitter } from './js/event-emitter.js';

const bus = new AdvancedEventEmitter();

// Listen for login events
bus.on('auth:login', (user) => {
  console.log(`Welcome, ${user.name}!`);
});

// Emit a login event
bus.emit('auth:login', { name: 'Alice', role: 'admin' });

// Wildcard listener — catches all events
bus.onAny((event, ...args) => {
  console.log(`[${event}] emitted with:`, args);
});
```

## 🎨 Customization

### Changing Component Behavior

- Modify the `HeaderComponent` class to change login/logout logic
- Add new events like `cart:update` or `notification:show`
- Create additional components that subscribe to existing events

### Styling

- Adjust CSS colors in the `<style>` section of `index.html`
- Modify the `theme:change` handler to use your own color scheme

### Emitter Configuration

```js
const bus = new AdvancedEventEmitter();
bus.setMaxListeners(20);  // Increase warning threshold
bus._warnings = false;    // Disable memory leak warnings
```

### Adding New Events

```js
// In any component
this.bus.emit('data:updated', { id: 123, value: 'new' });

// In another component
this.bus.on('data:updated', (data) => {
  // React to the update
});
```

## 📁 Project Structure

```text
event-emitter/
├── index.html          # Main HTML structure with component placeholders
├── app.js              # Component definitions and initialization
├── js/
│   ├── event-emitter.js   # EventEmitter & AdvancedEventEmitter classes
│   └── usage.js           # Basic usage examples and demo
└── README.md           # This file
```

## 🚀 Run Locally

Open `index.html` in any modern web browser. No installation, build tools, or server required — the project uses native ES modules and runs directly in the browser.

## 📝 License

MIT License — feel free to use this project for learning, teaching, or as a foundation for your own event-driven applications.
