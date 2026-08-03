import { AdvancedEventEmitter } from "./js/event-emitter.js";

const bus = new AdvancedEventEmitter();

// ------ Header Component ------
class HeaderComponent {
  constructor(el, bus) {
    this.el = el;
    this.bus = bus;
    this.user = null;

    this.render();
    this.setupEvents();
  }

  render() {
    this.el.innerHTML = `
            <h2>Header</h2>
            <button id="login-btn">Login</button>
            <button id="logout-btn">Logout</button>
            <span id="user-status"></span>
        `;
  }

  setupEvents() {
    document.getElementById("login-btn").addEventListener("click", () => {
      this.user = { name: "Alice", role: "admin" };
      this.bus.emit("auth:login", this.user);
      document.getElementById("user-status").textContent =
        `Logged in as ${this.user.name}`;
    });

    document.getElementById("logout-btn").addEventListener("click", () => {
      this.user = null;
      this.bus.emit("auth:logout");
      document.getElementById("user-status").textContent = "";
    });

    // Listen for theme changes from other components
    this.bus.on("theme:change", (theme) => {
      this.el.style.backgroundColor = theme === "dark" ? "#1a237e" : "#e3f2fd";
    });
  }
}

// ------ Sidebar Component ------
class SidebarComponent {
  constructor(el, bus) {
    this.el = el;
    this.bus = bus;
    this.render();
    this.setupListeners();
  }

  render() {
    this.el.innerHTML = `
            <h3>Sidebar</h3>
            <p>User info will appear here</p>
            <button id="toggle-theme">Toggle Dark Mode</button>
        `;
  }

  setupListeners() {
    // Listen for login/logout
    this.bus.on("auth:login", (user) => {
      this.el.querySelector("p").textContent =
        `Welcome, ${user.name} (${user.role})`;
    });

    this.bus.on("auth:logout", () => {
      this.el.querySelector("p").textContent = "Please log in.";
    });

    // Emit theme change when button clicked
    document.getElementById("toggle-theme").addEventListener("click", () => {
      // Determine next theme (simplified)
      const currentBg = this.el.style.backgroundColor;
      const nextTheme = currentBg === "rgb(26, 35, 126)" ? "light" : "dark";
      this.bus.emit("theme:change", nextTheme);
      // Also update own background
      this.el.style.backgroundColor =
        nextTheme === "dark" ? "#4a148c" : "#fce4ec";
    });
  }
}

// ------ Main Content Component ------
class MainComponent {
  constructor(el, bus) {
    this.el = el;
    this.bus = bus;
    this.user = null;
    this.render();

    // React to auth changes
    this.bus.on("auth:login", (user) => {
      this.user = user;
      this.showWelcome();
    });
    this.bus.on("auth:logout", () => {
      this.user = null;
      this.el.querySelector("#welcome-msg").textContent = "Not logged in";
    });
  }

  render() {
    this.el.innerHTML = `
            <h2>Main Content</h2>
            <p id="welcome-msg">Not logged in</p>
        `;
  }

  showWelcome() {
    document.getElementById("welcome-msg").textContent =
      `Hello, ${this.user.name}! Enjoy your ${this.user.role} privileges.`;
  }
}

// Initialize
const header = new HeaderComponent(document.getElementById("header"), bus);
const sidebar = new SidebarComponent(document.getElementById("sidebar"), bus);
const main = new MainComponent(document.getElementById("main"), bus);
