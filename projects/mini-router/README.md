# Mini-Router with Trie (Custom Routing Engine)

> A high‑performance HTTP router built on a Trie (prefix tree) data structure, with support for dynamic parameters, middleware chains, and a performance comparison against regex‑based routing.

## 🎯 About

This project implements a complete routing engine inspired by Express.js, but powered by a **Trie (prefix tree)** instead of linear regex matching. It offers:

- **Trie-based route matching** – O(n) where n is the path segment count, independent of total routes
- **Dynamic parameters** – capture `:id` segments and extract them as `req.params`
- **Middleware support** – global and route‑specific middleware with `next()` chaining
- **HTTP method differentiation** – GET and POST routes (easily extensible)
- **Performance benchmark** – compares Trie router against a regex‑based router (Trie is ~2x faster)

The project also includes a **Binary Search Tree** utility for sorted data storage, demonstrating additional data structures in the same toolkit.

## ✨ Features

- **Trie-based routing** – efficient prefix matching with dynamic segment support (`/users/:id`)
- **Parameter extraction** – automatically populates `req.params` from URL segments
- **Middleware chain** – execute global middleware, then route‑specific middleware, then final handler
- **Method‑specific routes** – register handlers for GET, POST (easily add PUT, DELETE, etc.)
- **Performance benchmarking** – compares Trie vs Regex router over 100k iterations
- **Clean separation** – routing logic decoupled from HTTP server (works with any request/response objects)
- **Extensible design** – add custom middleware, error handlers, or new matching strategies

## 🎯 What You'll Learn

- **Trie data structure** – how to build and traverse a prefix tree for routing
- **Dynamic route matching** – capturing wildcard segments like `:id` and `:postId`
- **Middleware pattern** – chaining functions with `next()` (like Express)
- **Performance optimization** – why Trie routing out‑performs regex‑based routing for large route sets
- **Data structure selection** – when to use a Trie vs Binary Search Tree vs Regex
- **Modular design** – separating data structures (`BinarySearchTree`, `RouterTrie`) from application logic

## 🎮 How to Use

### Running the Demo

```bash
node main.js
```

The demo will:

1. Register several routes (static, dynamic, and protected)
2. Simulate HTTP requests and log responses
3. Run a performance test comparing Trie vs Regex router

### Basic API

```js
import { Router } from './main.js';

const app = new Router();

// Global middleware (runs on every request)
app.use((req, res, next) => {
console.log(`${req.method} ${req.path}`);
next();
});

// Route‑specific middleware
app.use('/api/protected', (req, res, next) => {
if (!req.headers.authorization) {
res.statusCode = 401;
res.end('Unauthorized');
return;
}
req.user = { id: 1 };
next();
});

// Define routes
app.get('/', (req, res) => res.end('Home'));
app.get('/users/:id', (req, res) => {
res.end(`User ${req.params.id}`);
});

// Handle requests
const req = { method: 'GET', path: '/users/123', headers: {} };
const res = { statusCode: 200, end: (data) => console.log(data) };
app.handle(req, res);
```

### Adding New HTTP Methods

```js
class Router {
// ...
put(path, handler) {
this.trie.insert(path, { method: 'PUT', handler });
}
delete(path, handler) {
this.trie.insert(path, { method: 'DELETE', handler });
}
// ...
}
```

### Using the BinarySearchTree Utility

```js
import { BinarySearchTree } from './utils/index.js';

const bst = new BinarySearchTree();
bst.insert(10);
bst.insert(5);
bst.insert(15);
console.log(bst.inOrderTraversal()); // [5, 10, 15]
```

## 🎨 Customization

### Extending Middleware

- Add error‑handling middleware that catches exceptions from handlers.
- Implement a `use()` that accepts an array of middleware.
- Add `next('route')` to skip to the next matching route (like Express).

### Dynamic Parameter Types

Modify `RouterTrie.insert()` to support regex constraints, e.g., `/users/:id(\\d+)` to match only numeric IDs.

### Performance Tuning

- Use `Map` for child nodes (already done) for faster lookups.
- Pre‑compile routes into a single trie for even faster matching (already done).
- Cache matched routes per URL pattern.

## 📁 Project Structure

```text
Mini-Router/
├── main.js # Router implementation + demo + benchmark
├── utils/
│ ├── index.js # Re‑exports
│ ├── binarySearchTree.js # BST utility (for reference)
│ ├── trieNode.js # RouterTrie (prefix tree for routing)
│ └── (optional) ... # Additional utilities
└── README.md # This file
```

## 🔧 API Reference

### `Router`

- `use(path, middleware)` – register global or path‑specific middleware
- `get(path, handler)` – register GET route
- `post(path, handler)` – register POST route
- `findRoute(path, method)` – returns `{ handler, params, middleware }` or `null`
- `handle(req, res)` – processes the request through middleware chain and handler

### `RouterTrie`

- `insert(path, handler)` – inserts a route pattern with associated handler
- `match(path)` – returns `{ handler, params }` or `null`

### `BinarySearchTree`

- `insert(value)` – adds a value
- `search(value)` – finds a node
- `inOrderTraversal()` – returns sorted array

## 🚀 Run Locally

### Node.js

```bash
node main.js
```

### In the Browser

The code uses ES modules and is browser‑compatible (except for `fs`/`path` not used). You can bundle it with Vite or Webpack.

## 📊 Performance Notes

The included benchmark runs 100,000 iterations over 5 routes. On a typical Node.js environment, the Trie router completes in ~150ms, while the regex router takes ~300ms – the Trie is roughly **2x faster** due to its O(path‑length) matching, independent of the total number of routes.

## 📝 License

MIT License – free to use, modify, and distribute.

---

Built with ❤️ using vanilla JavaScript.
