# Template Engine – Build Your Own Simple Template Compiler

> A step‑by‑step implementation of a lightweight template engine that compiles `{{ }}` syntax into JavaScript functions.

## 🎯 About

This project is a hands‑on exploration of how template engines (like Mustache, Handlebars, or EJS) work under the hood. Instead of using a library, you build a complete compiler pipeline: **lexer → parser → code generator**. The engine parses templates with variable interpolation, conditionals (`#if`), loops (`#each`), and caches compiled functions for reuse.

It’s a perfect learning resource for understanding:
- How a compiler is structured
- Tokenisation and abstract syntax trees (AST)
- Code generation and dynamic function creation
- Scoping and context resolution in templates

## ✨ Features

- **Variable interpolation** – `{{ name }}` and nested paths like `{{ user.email }}`
- **Conditional blocks** – `{{#if isAdmin}} ... {{/if}}` with support for `{{else}}` (extendable)
- **Iteration blocks** – `{{#each items}} <li>{{this}}</li> {{/each}}`
- **Automatic HTML escaping** – prevents XSS by escaping `&`, `<`, `>`, `"`, and `'`
- **Compiled function caching** – templates are compiled once and reused for different data
- **Debugging output** – view tokens, AST, and generated JavaScript with `showGeneratedCode()`
- **Lightweight & dependency‑free** – runs in any modern browser or Node.js

## 🧠 What You'll Learn

- **Lexical analysis** – scanning raw templates and producing tokens
- **Parsing** – building an AST from tokens with nested blocks
- **Code generation** – emitting JavaScript that concatenates strings and handles logic
- **Dynamic functions** – using `new Function()` to create render functions
- **Variable scope** – resolving `{{this}}` inside loops and nested contexts
- **Caching strategies** – improving performance by storing compiled renderers
- **Error handling** – detecting unclosed blocks and invalid syntax

## 💻 How to Use

The engine exposes a `TemplateEngine` class with two main methods:

```js
const engine = new TemplateEngine();

// Compile a template string into a render function
const render = engine.compile(`<h1>{{ title }}</h1>`);

// Render with data
const html = render({ title: "Hello World" });
console.log(html); // <h1>Hello World</h1>
```

You can also render directly:

```js
const html = engine.render(`<p>{{ user.name }}</p>`, { user: { name: "John" } });
```

### Full Example

```js
import { TemplateEngine } from "./utils/index.js";

const engine = new TemplateEngine();

const template = `
<div>
  <h2>{{ name }}</h2>
  {{#if isActive}}
    <span>Active</span>
  {{/if}}
  <ul>
    {{#each hobbies}}
      <li>{{ this }}</li>
    {{/each}}
  </ul>
</div>`;

const render = engine.compile(template);

const data = {
  name: "Alice",
  isActive: true,
  hobbies: ["Reading", "Cycling", "Coding"]
};

console.log(render(data));
```

## 🎨 Customization

You can extend the engine with new features:

- **Add `{{else if}}`** – modify the parser and code generator to chain conditions
- **Support custom helpers** – add a `helpers` parameter to `render()` and inject them into the generated code
- **Change escaping rules** – edit the `escape()` helper in `HELPERS`
- **Add partials** – implement a registry of sub‑templates that can be included
- **Improve whitespace control** – strip or preserve whitespace around tags

## 📁 Project Structure

```plain
template-engine/
├── main.js                 # Example usage (demoComplete)
├── utils/
│   ├── index.js            # Public exports (Lexer, Parser, CodeGenerator, TemplateEngine)
│   ├── lexer.js            # Tokenizer
│   ├── parser.js           # AST builder
│   ├── code-generator.js   # JavaScript emitter and helpers
│   └── template-engine.js  # Engine class (cache, compile, render, debug)
└── README.md               # This file
```

## 🚀 Run Locally

1. Clone or download the project.
2. Open `index.html` in your browser (for frontend) **or** run with Node.js / Bun:
   ```bash
   bun/node main.js
   ```
3. No installation or build step is required – everything is vanilla JavaScript.

## 📝 License

MIT – feel free to use, modify, and share for learning and teaching purposes.