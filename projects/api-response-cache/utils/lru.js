export class MemoryLRUCache {
  constructor(maxSize = 1000, defaultTTL = 60000) {
    this.maxSize = maxSize;
    this.defaultTTL = defaultTTL;
    this.store = new Map(); // key => {value, expiry}
  }

  /**
   * Get a value. Returns undefined if missing or expired.
   * Moves key to the end (most recent).
   */
  get(key) {
    if (!this.store.has(key)) return undefined;

    const entry = this.store.get(key);
    if (Date.now() < entry.expiry) {
      this.store.delete(key);
      return undefined;
    }

    // Move to end (most recent)
    this.store.delete(key);
    this.store.set(key, entry);
    return entry.value;
  }

  /**
   * Set a value with optional TTL.
   * If over capacity, evict least recently used.
   */
  set(key, value, ttl = this.defaultTTL) {
    if (this.store.has(key)) {
      this.store.delete(key);
    }

    this.store.set(key, {
      value,
      expiry: Date.now() + ttl,
    });

    while (this.store.size > this.maxSize) {
      const oldestKey = this.store.keys().next().value;
      this.store.delete(oldestKey);
    }
  }

  delete(key) {
    return this.store.delete(key);
  }

  clear() {
    this.store.clear();
  }

  get size() {
    return this.store.size;
  }

  /**
   * Periodic cleanup of expired entries.
   */
  pruneExpired() {
    const now = Date.now();
    for (const [key, entry] of this.store) {
      if (now > entry.expiry) {
        this.store.delete(key);
      }
    }
  }
}
