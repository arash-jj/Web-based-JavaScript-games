# di-system

> A lightweight, hands-on Dependency Injection (DI) container built from scratch to understand IoC and service resolution without decorators.

## 🔧 About

**di-system** is a fully functional DI container implementation written in plain JavaScript. It demonstrates the core mechanics of Inversion of Control (IoC) by allowing you to register services (factories, classes, or constants) and resolve them with singleton or transient lifetimes. The project includes a sample application with realistic services—Database, Email, Logger, Cache, Repository, and Business Logic—to show how DI simplifies dependency management and promotes testability.

This project is ideal for developers who want to peek under the hood of frameworks like NestJS, Spring, or Angular, and learn how DI containers work without the magic of decorators or metadata reflection. It focuses on manual wiring, circular dependency detection, and practical usage.

## ✨ Features

- **Custom DI Container** – register factories, classes, or values; resolve dependencies with automatic parameter name matching.
- **Singleton & Transient Scopes** – control instance lifetime per registration.
- **Circular Dependency Detection** – prevents infinite loops with a `resolving` Set.
- **Realistic Service Examples** – Database, Email, Logger, Cache, Repository, UserService, and an Application bootstrap.
- **Simple & Transparent** – no decorators, no external libraries—just plain JavaScript.
- **Debugging Support** – built-in `debug()` method to inspect registrations and cached instances.
- **Clean Shutdown** – graceful disconnection of database and logging.

## 🎯 What You'll Learn

- How a DI container works internally (registration, resolution, caching).
- The difference between singleton and transient lifetimes.
- How to manually wire dependencies using factory functions.
- How to detect and prevent circular dependencies.
- The benefits of Inversion of Control for decoupling and testing.
- How to structure an application with service, repository, and business logic layers.
- How to bootstrap an application using a container and manage lifecycle (start/stop).

## 💻 How to Use

1. **Clone or download** the project files.
2. **Install Node.js** (if not already installed).
3. **Run the application** from the terminal: `node main.js`
4. **Observe the output** – the app will:
   - Connect to a simulated database.
   - Register all services in the DI container.
   - Create a new user, send a welcome email, and retrieve the user (first from DB, then from cache).
5. **Experiment** – modify `main.js` to change configuration, add new services, or test different scenarios.

## 🎨 Customization

- **Configuration**: Update the `config` object in `main.js` (database host/port, email API key, log level, cache TTL).
- **Service Implementation**: Replace the dummy `sleep()` and `console.log` in `services.js` with real implementations (e.g., connect to a real database, use an actual email provider).
- **Container Scopes**: Change `singleton: false` in registration options to make a service transient.
- **Add New Services**: Register new classes or factories in `createAppContainer()` and resolve them anywhere in the app.
- **Extend the Container**: Try implementing decorator-based injection, automatic dependency resolution by type, or child containers as a challenge.

## 📁 Project Structure

```text
di-system/
├── container.js      # DI container implementation (register, resolve, circular detection)
├── services.js       # All service classes (Database, Email, Logger, Cache, Repository, UserService, Application)
├── main.js           # Container setup, registration, and application run loop
└── README.md         # This file
```

## 🚀 Run Locally

1. Ensure you have Node.js (v12 or higher) installed.
2. Open a terminal in the project folder.
3. Run the following command:
   ```bash
   node main.js
   ```
4. Watch the console logs to see the DI container in action.

No installation, build steps, or external dependencies are required – it's pure JavaScript.

## 📝 License

MIT License – feel free to use, modify, and distribute for learning and production purposes.