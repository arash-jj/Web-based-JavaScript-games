export class EventEmitter {
  constructor() {
    // Map event name => array of listeners
    this._events = new Map();
  }

  /**
   * Register an event listener.
   * @param {string} event - Event name
   * @param {Function} listener - Callback function.
   * @returns {EventEmitter} this (for chaining)
   */
  on(event, listener) {
    if (!this._events.has(event)) {
      this._events.set(event, []);
    }
    this._events.get(event).push(listener);
    return this; // Enable chaining: emitter.on('a', fn).on('b', fn)
  }

  /**
   * Register a one-time listener (auto-removed after first execution).
   */
  once(event, listener) {
    const wrapper = (...args) => {
      this.off(event, wrapper); // Remove itself
      listener.apply(this, args);
    };
    // Store reference to original for off() to work correctly
    wrapper._original = listener;
    return this.on(event, wrapper);
  }

  /**
   * Remove a specific listener or all listeners for an event.
   * @param {string} event - Event name.
   * @param {Function} [listener] - Specific callback to remove. If omitted, removes all.
   */
  off(event, listener) {
    if (!this._events.has(event)) return this;

    if (!listener) {
      // Remove all listeners for this event
      this._events.delete(event);
      return this;
    }

    const listeners = this._events.get(event);
    const filtered = listeners.filter((fn) => {
      // Check both the function itself and the ._original for once wrappers
      return fn !== listener && fn._original !== listener;
    });

    if (filtered.length === 0) {
      this._events.delete(event);
    } else {
      this._events.set(event, filtered);
    }
    return this;
  }

  /**
   * Emit an event, invoking all registered listeners with supplied arguments.
   */
  emit(event, ...args) {
    if (!this._events.has(event)) return false;

    const listeners = [...this._events.get(event)]; // Clone to avoid mutation during loop
    for (const listener of listeners) {
      listener.apply(this, args);
    }
    return true; // Event had listeners
  }

  /**
   * Get count of listeners for an event.
   */
  listenerCount(event) {
    return (this._events.get(event) || []).length;
  }

  /**
   * Remove all listeners.
   */
  removeAllListeners() {
    this._events.clear();
    return this;
  }
}

export class AdvancedEventEmitter extends EventEmitter {
  constructor() {
    super();
    this._maxListeners = 10; // Default Node.js value
    this._warnings = true;
  }

  /**
   *  Set maximum listeners for an event before warning.
   */
  setMaxListeners(n) {
    this._maxListeners = n;
    return this;
  }

  on(event, listener) {
    super.on(event, listener);

    // Check listener count and warn
    if (this._warnings && this.listenerCount(event) > this._maxListeners) {
      console.warn(
        `MaxListenersExceededWarning: Possible EventEmitter memory leak detected. ` +
          `${this.listenerCount(event)} ${event} listeners added. ` +
          `Use emitter.setMaxListeners() to increase limit`,
      );
    }
    return this;
  }

  /**
   * Emit with error handling - if an 'error' event has no listeners, throw.
   */
  emit(event, ...args) {
    if (
      event === "error" &&
      !this._events.has("error") &&
      args[0] instanceof Error
    ) {
      throw args[0];
    }
    return super.emit(event, ...args);
  }

  /**
   * Return array of event names with registered listeners.
   */
  eventNames() {
    return Array.from(this._events.keys());
  }

  /**
   * Return copy of listeners for an event.
   */
  listeners(event) {
    return [...(this._events.get(event) || [])];
  }

  /**
   * Alias for on
   */
  addListener(event, listener) {
    return this.on(event, listener);
  }

  /**
   * Alias for off
   */
  removeListener(event, listener) {
    return this.off(event, listener);
  }

  /**
   * Wildcard listener – matches events using '*' or prefix matching
   */
  onAny(fn) {
    return this.on("*", fn);
  }

  emit(event, ...args) {
    // Emit to specific listeners
    super.emit(event, ...args);
    // Emit to wildcard listeners
    if (event !== "*") {
      super.emit("*", event, ...args);
    }
    return this;
  }
}
