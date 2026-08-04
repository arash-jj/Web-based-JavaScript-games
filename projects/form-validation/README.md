# Form Validation (Middleware Composer & Validation Pipeline)

> A flexible middleware composition library supporting synchronous, asynchronous, and error-handling middlewares, with a real‑world form validation pipeline.

## 🎯 About

This project implements a **middleware composition** pattern inspired by Koa and Express.js. It allows you to build reusable, composable processing pipelines where each step (middleware) can modify a shared context, perform async operations, and optionally pass control to the next middleware.

The library provides three variants:

- **`compose`** – synchronous pipeline (no async)
- **`asyncCompose`** – supports async/await middlewares
- **`composeWithErrorHandling`** – adds error propagation and dedicated error‑handling middlewares (identified by arity 3)

The example application uses these tools to build a **form validation pipeline** that checks email, password, phone number, and terms acceptance, collecting errors along the way and aborting early if needed.

## ✨ Features

- **Composable middleware** – build pipelines from small, focused functions
- **Async support** – middlewares can be `async` and `await next()`
- **Error handling** – dedicated error middlewares (err, ctx, next) catch and process errors
- **Context sharing** – a single `ctx` object passes through the entire pipeline
- **Early termination** – middlewares can choose not to call `next()` to stop the chain
- **Zero dependencies** – pure vanilla JavaScript, works in Node.js and browsers
- **Real‑world demo** – form validation with multiple rules and error aggregation

## 🎯 What You'll Learn

- **Middleware pattern** – how to build processing chains with `next()` callbacks
- **Composition** – combining functions into a single execution flow
- **Async control flow** – managing asynchronous operations in a pipeline
- **Error propagation** – catching and handling errors in a middleware stack
- **Validation pipelines** – structuring validation logic in a maintainable way
- **Function arity** – using `fn.length` to detect error‑handling middlewares

## 🎮 How to Use

### Basic Synchronous Pipeline

```js
import { compose } from "./utils/composer.js";

const pipeline = compose([
  (ctx, next) => {
    console.log("1. Start");
    next();
    console.log("1. End");
  },
  (ctx, next) => {
    console.log("2. Start");
    next();
    console.log("2. End");
  },
  (ctx) => {
    console.log("3. Handler");
    ctx.body = "Hello World";
  },
]);

const ctx = {};
pipeline(ctx);
// Output: 1. Start → 2. Start → 3. Handler → 2. End → 1. End
```

### Async Pipeline with Validation

```js
import { asyncCompose } from "./utils/asyncComposer.js";

const validateEmail = async (ctx, next) => {
  if (!ctx.data.email?.includes("@")) {
    ctx.errors.push("Invalid email");
  }
  await next();
};

const pipeline = asyncCompose([validateEmail /* ... */]);
const ctx = { data: { email: "test" }, errors: [] };
await pipeline(ctx);
console.log(ctx.errors); // ['Invalid email']
```

### Error Handling Middleware

```js
import { composeWithErrorHandling } from "./utils/composerWithErrorHandling.js";

const pipeline = composeWithErrorHandling([
  async (ctx, next) => {
    throw new Error("Something went wrong");
  },
  (err, ctx, next) => {
    console.log("Caught:", err.message);
    ctx.error = err.message;
    // optionally call next() to continue
  },
]);

await pipeline({});
```

### Form Validation Example

Run the included `main.js` to see a complete validation pipeline in action:

```js
import { submitForm } from "./main.js";

const result = await submitForm({
  email: "bad",
  password: "123",
  phone: "(555) 123-4567",
  terms: false,
});

console.log(result);
// {
// success: false,
// errors: ['Email is invalid', 'Password must be at least 8 characters', 'You must accept the terms'],
// data: { email: 'bad', password: '123', phone: '5551234567' }
// }
```

## 🎨 Customization

### Adding New Middleware

Create a function that receives `(ctx, next)` (or `(err, ctx, next)` for error handlers) and performs operations. Call `await next()` to continue the chain, or omit it to stop.

### Changing Pipeline Order

The order of middlewares in the array determines execution order. Place `abortIfErrors` early to stop processing when errors exist.

### Dynamic Pipelines

You can compose different pipelines for different routes or scenarios:

```js
function createRegistrationPipeline() {
  return asyncCompose([
    abortIfErrors,
    validateEmail,
    validatePassword,
    normalizePhone,
    ensureTermsAccepted,
    // additional registration logic
  ]);
}
```

### Custom Error Handlers

Error‑handling middlewares have arity 3 and receive the error as first argument. They can handle, log, or transform errors, and optionally call `next()` to pass to the next error handler.

## 📁 Project Structure

```text
form-validation/
├── main.js # Form validation pipeline demo
├── utils/
│ ├── index.js # Re‑exports all composers
│ ├── composer.js # Synchronous compose
│ ├── asyncComposer.js # Async compose
│ ├── composerWithErrorHandling.js # Error‑aware compose
│ └── (optional) ... # Additional utilities
└── README.md # This file
```

## 🚀 Run Locally

### In Node.js (ES Modules)

Make sure your `package.json` has `"type": "module"` or use `.mjs` extension.

```
node/bun main.js
```

### In the Browser

Use `<script type="module">` with import maps or bundle with a tool like Vite.

No installation required – just clone and run.

## 📝 License

MIT License – free to use, modify, and distribute.
