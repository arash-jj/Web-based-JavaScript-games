# API Response Cache - Multi‑Strategy Cache (LRU + Disk Persistence)

> A powerful caching system combining in‑memory LRU storage with optional disk persistence, TTL, automatic eviction, and periodic cleanup.

## 🎯 About

This project implements a **multi‑strategy cache** that combines the speed of memory‑based LRU (Least Recently Used) caching with the durability of disk persistence. It's ideal for applications that need fast access to frequently used data while surviving restarts and avoiding repeated expensive operations (API calls, database queries, computation).

The system consists of three layers:

- **`MemoryLRUCache`** – efficient in‑memory cache with configurable max size and TTL, using a JavaScript `Map` to maintain LRU order (most recent at end).
- **`DiskPersister`** – atomic file‑based persistence using a temporary file and rename, ensuring data integrity.
- **`MultiStrategyCache`** – orchestrates both, providing a unified API with automatic background saves and periodic expiration pruning.

The demonstration in `main.js` simulates an API cache that fetches data from a remote endpoint, caches responses in memory with a 30‑second TTL, persists the cache to disk every 10 seconds, and restores it on startup.

## ✨ Features

- **In‑memory LRU cache** – O(1) get/set with automatic eviction of least recently used items when capacity is exceeded.
- **Time‑to‑Live (TTL)** – each entry expires after a configurable duration (default 60 seconds).
- **Disk persistence** – save the entire cache to a JSON file atomically; load on initialization.
- **Automatic background save** – configurable interval to write changes to disk.
- **Periodic expiration pruning** – removes expired entries every 60 seconds to free memory.
- **Atomic writes** – uses a temporary file and rename to prevent corruption.
- **Unified API** – simple `get`, `set`, `delete`, `clear` methods.
- **Graceful shutdown** – final save before destroying the cache instance.

## 🎯 What You'll Learn

- **LRU cache implementation** – using a `Map` to maintain access order and evict oldest entries.
- **Cache eviction policies** – understanding LRU and TTL (Time‑To‑Live).
- **Persistence strategies** – saving in‑memory state to disk and restoring on startup.
- **Atomic file operations** – preventing partial writes using temporary files.
- **Background tasks** – using `setInterval` for periodic maintenance and saves.
- **Caching patterns** – wrapping expensive operations with a cache‑aware function.

## 🎮 How to Use

### Basic Usage

```js
import { MultiStrategyCache } from "./utils/cache.js";

const cache = new MultiStrategyCache({
  maxSize: 1000,
  defaultTTL: 60000, // 1 minute
  persistPath: "./cache/data.json",
  autoSaveInterval: 5000, // save every 5 seconds
});

await cache.init(); // restore from disk if present

// Store a value
cache.set("user:123", { name: "Alice" }, 30000); // TTL 30s

// Retrieve (returns undefined if expired or missing)
const user = cache.get("user:123");

// Delete
cache.delete("user:123");

// Clear all
cache.clear();

// Graceful shutdown
await cache.destroy();
```

### Using with an API Wrapper

```js
async function fetchWithCache(endpoint) {
  const cached = apiCache.get(endpoint);
  if (cached) return cached;

  const fresh = await fetchFromAPI(endpoint);
  apiCache.set(endpoint, fresh);
  return fresh;
}
```

### Manual Save

You can manually trigger a disk save at any time:

```js
await apiCache.saveToDisk();
```

### Statistics

```js
console.log(apiCache.stats);
// { memorySize: 42, maxSize: 500, persistPath: './cache/api-cache.json' }
```

## 🎨 Customization

### Cache Configuration

| Option             | Default | Description                                       |
| ------------------ | ------- | ------------------------------------------------- |
| `maxSize`          | `1000`  | Maximum number of entries in memory               |
| `defaultTTL`       | `60000` | Default TTL in milliseconds                       |
| `persistPath`      | `null`  | File path for disk persistence (disabled if null) |
| `autoSaveInterval` | `0`     | Auto‑save interval in ms (0 = disabled)           |

### Changing TTL Per Item

```js
cache.set("key", value, 5000); // 5 seconds
cache.set("key", value); // uses defaultTTL
```

### Disabling Persistence

Simply omit `persistPath` to run purely in memory.

### Customizing the LRU Implementation

You can replace `MemoryLRUCache` with your own variant (e.g., using doubly linked list) while keeping the same interface.

### Handling Backups

The `DiskPersister` saves as JSON. You can extend it to compress or encrypt the data.

## 📁 Project Structure

```text
api-response-cache/
├── main.js                     # API caching demo with TTL & persistence
├── utils/
│   ├── index.js                # Re‑exports modules
│   ├── lru.js                  # MemoryLRUCache (Map‑based LRU + TTL)
│   ├── diskPersister.js        # DiskPersister (atomic file I/O)
│   ├── cache.js                # MultiStrategyCache (orchestrator)
│   └── (optional) ...          # Additional utilities
├── cache/                      # Created at runtime for persisted data
│   └── api-cache.json          # Example persistence file
└── README.md                   # This file
```

## 🔧 API Reference

### `MemoryLRUCache(maxSize, defaultTTL)`

- `get(key)` – returns value or `undefined` if missing/expired; moves key to most recent.
- `set(key, value, ttl)` – stores value with optional TTL; evicts LRU if over capacity.
- `delete(key)` – removes entry.
- `clear()` – empties cache.
- `pruneExpired()` – removes all expired entries.
- `size` – current number of entries.

### `DiskPersister(filePath)`

- `save(data)` – atomically writes a JSON‑serializable object to disk.
- `load()` – reads and parses the JSON file; returns `{}` if file doesn't exist.

### `MultiStrategyCache(options)`

- `init()` – loads from disk (if persistence enabled) and restores non‑expired entries.
- `get(key)` – proxy to memory LRU.
- `set(key, value, ttl)` – stores in memory (and optionally triggers auto‑save).
- `delete(key)` – removes from memory.
- `saveToDisk()` – manually persists the current memory state.
- `destroy()` – stops timers and saves one last time.
- `stats` – object with cache statistics.

## 🚀 Run Locally

### Node.js

Make sure you have a `package.json` with `"type": "module"` or use `.mjs` extension.

```bash
node main.js
```

### Bun

```bash
bun run main.js
```

### In the Browser

The disk persistence uses Node.js `fs` module, so it's Node‑only. For browser, you can implement a `DiskPersister` that uses `localStorage` or IndexedDB.

## 📝 License

MIT License – free to use, modify, and distribute.
