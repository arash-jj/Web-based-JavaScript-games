import { DiskPersister } from "./diskPersistence";
import { MemoryLRUCache } from "./lru";

export class MultiStrategyCache {
  constructor(options = {}) {
    this.memory = new MemoryLRUCache(
      options.maxSize || 1000,
      options.defaultTTL || 60000,
    );
    this.persistPath = options.persistPath;
    this.autoSaveInterval = options.autoSaveInterval || 0; // ms
    this.persister = this.persistPath
      ? new DiskPersister(this.persistPath)
      : null;

    // Auto‑save timer
    if (this.autoSaveInterval > 0) {
      this._saveTimer = setInterval(
        () => this.saveToDisk(),
        this.autoSaveInterval,
      );
    }

    // Auto‑prune expired entries every 60s
    this._pruneTimer = setInterval(() => this.memory.pruneExpired(), 60000);
  }

  async init() {
    if (this.persister) {
      const data = await this.persister.load();
      // Restore to memory (respect TTL – only load non‑expired)
      const now = Date.now();
      for (const [key, entry] of Object.entries(data)) {
        if (entry.expiry > now) {
          this.memory.store.set(key, entry);
        }
      }
      // Evict if restored data exceeds capacity (LRU order will be arbitrary)
      while (this.memory.store.size > this.memory.maxSize) {
        const oldestKey = this.memory.store.keys().next().value;
        this.memory.store.delete(oldestKey);
      }
    }
  }

  get(key) {
    return this.memory.get(key);
  }

  set(key, value, ttl) {
    this.memory.set(key, value, ttl);
    // Optionally auto‑save on every set (may be heavy)
    // if (this.persister) this.saveToDisk();
  }

  delete(key) {
    this.memory.delete(key);
  }

  async saveToDisk() {
    if (!this.persister) return;
    // Convert Map to plain object
    const obj = {};
    for (const [key, entry] of this.memory.store) {
      obj[key] = entry;
    }
    await this.persister.save(obj);
  }

  async destroy() {
    clearInterval(this._pruneTimer);
    if (this._saveTimer) clearInterval(this._saveTimer);
    await this.saveToDisk(); // final save
  }

  get stats() {
    return {
      memorySize: this.memory.size,
      maxSize: this.memory.maxSize,
      persistPath: this.persistPath,
    };
  }
}
