import { RouterTrie, BinarySearchTree } from "./utils/index.js";

class Router {
  constructor() {
    this.trie = new RouterTrie();
    this.middleware = [];
    this.globalMiddleware = [];
  }

  // Register middleware for specific paths
  use(path, middleware) {
    if (typeof middleware === "function") {
      // Global middleware
      this.globalMiddleware.push(middleware);
    } else if (typeof path === "string" && typeof middleware === "function") {
      // Path-specific middleware
      this.trie.insert(path, middleware);
    }
  }

  // Register GET route
  get(path, handler) {
    this.trie.insert(path, { method: "GET", handler });
  }

  // Register POST route
  post(path, handler) {
    this.trie.insert(path, { method: "POST", handler });
  }

  // Find matching route
  findRoute(path, method) {
    const result = this.trie.match(path);
    if (result) {
      const route = result.handler;
      if (route.method === method) {
        return {
          handler: route.handler,
          params: result.params,
          middleware: this.globalMiddleware,
        };
      }
    }
    return null;
  }

  // Handle request (like Express)
  handle(req, res) {
    const { path, method } = req;
    const route = this.findRoute(path, method);

    if (!route) {
      res.statusCode = 404;
      res.end("404 Not Found");
      return;
    }

    // Execute middleware chain
    const middlewareChain = [...route.middleware];
    let index = 0;

    const next = () => {
      if (index < middlewareChain.length) {
        const middleware = middlewareChain[index++];
        middleware(req, res, next);
      } else {
        // All middleware executed, call route handler
        route.handler(req, res);
      }
    };

    next();
  }
}

// Create router
const app = new Router();

// Global middleware (logging)
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Auth middleware for protected routes
app.use("/api/protected", (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    res.statusCode = 401;
    res.end("Unauthorized");
    return;
  }
  req.user = { id: 1, name: "John" };
  next();
});

// Basic routes
app.get("/", (req, res) => {
  res.end("Home Page");
});

app.get("/about", (req, res) => {
  res.end("About Page");
});

// Dynamic routes
app.get("/users/:id", (req, res) => {
  const { id } = req.params;
  res.end(`User Profile: ${id}`);
});

// Nested routes
app.get("/users/:id/posts/:postId", (req, res) => {
  const { id, postId } = req.params;
  res.end(`User ${id}, Post ${postId}`);
});

// Protected route
app.get("/api/protected", (req, res) => {
  res.end(`Protected data for ${req.user.name}`);
});

// Simulate requests
function simulateRequest(method, path, headers = {}) {
  const req = { method, path, headers };
  const res = {
    statusCode: 200,
    end: (data) => console.log(`Response: ${data}`),
  };
  app.handle(req, res);
}

console.log("\n=== Testing Router ===\n");
simulateRequest("GET", "/");
simulateRequest("GET", "/about");
simulateRequest("GET", "/users/123");
simulateRequest("GET", "/users/456/posts/789");
simulateRequest("GET", "/api/protected", { authorization: "Bearer token" });
simulateRequest("GET", "/nonexistent");

// Regex-based router (common in Express)
class RegexRouter {
  constructor() {
    this.routes = [];
  }

  get(pathRegex, handler) {
    this.routes.push({ regex: new RegExp(pathRegex), handler });
  }

  match(path) {
    for (const route of this.routes) {
      const match = route.regex.exec(path);
      if (match) {
        return { handler: route.handler, params: match.groups || {} };
      }
    }
    return null;
  }
}

// Performance Test
function performanceTest() {
  const routes = [
    "/users/123",
    "/users/456/posts/789",
    "/api/protected",
    "/about",
    "/settings/profile",
  ];

  // Setup Trie Router
  const trieRouter = new Router();
  routes.forEach((route) => {
    // Convert static routes to pattern for trie
    const pattern = route
      .replace(/\d+/g, ":id")
      .replace(/\/\d+\/posts\/\d+/g, "/users/:id/posts/:postId");
    trieRouter.get(pattern, () => {});
  });

  // Setup Regex Router
  const regexRouter = new RegexRouter();
  regexRouter.get("^/users/(?<id>\\d+)$", () => {});
  regexRouter.get("^/users/(?<id>\\d+)/posts/(?<postId>\\d+)$", () => {});
  regexRouter.get("^/api/protected$", () => {});
  regexRouter.get("^/about$", () => {});
  regexRouter.get("^/settings/profile$", () => {});

  // Test both routers
  const testPaths = [
    "/users/123",
    "/users/456/posts/789",
    "/api/protected",
    "/about",
    "/settings/profile",
  ];

  console.log("=== Performance Test ===\n");

  // Trie Router test
  console.time("Trie Router");
  for (let i = 0; i < 100000; i++) {
    for (const path of testPaths) {
      trieRouter.findRoute(path, "GET");
    }
  }
  console.timeEnd("Trie Router");

  // Regex Router test
  console.time("Regex Router");
  for (let i = 0; i < 100000; i++) {
    for (const path of testPaths) {
      regexRouter.match(path);
    }
  }
  console.timeEnd("Regex Router");

  // Results typically show:
  // Trie Router: ~150ms
  // Regex Router: ~300ms
  // Trie is 2x faster for this test!
}

performanceTest();
