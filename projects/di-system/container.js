/** 
 * Dev Note: feel free to explore the container 
 * and trying to an `AdvanceDiContainer` with Decorators 
 * if you are looking for challenge
*/

export class DIcontainer {
  constructor() {
    this.registrations = new Map();
    this.instances = new Map(); // For singletons
    this.resolving = new Set(); // Circular dependency detection
  }

  // Register a factory function
  register(key, factory, options = {}) {
    this.registrations.set(key, {
      factory,
      singleton: options.singleton !== false, // Default singleton
      dependencies: options.dependencies || [],
    });
    return this;
  }

  // Register a constant value
  registerValue(key, value) {
    this.registrations.set(key, {
      factory: () => value,
      singleton: true,
      dependencies: [],
    });
    return this;
  }

  registerClass(key, Class, options = {}) {
    this.registrations.set(key, {
      factory: (container) => {
        // Get constructor parameter names
        const paramNames = this._getParamNames(Class);

        // Resolve dependencies from parameter names
        const dependencies = paramNames.map((param) =>
          container.resolve(param),
        );

        return new Class(...dependencies);
      },
      singleton: options.singleton !== false,
      dependencies: this._getParamNames(Class),
    });
    return this;
  }

  // Resolve a dependency
  resolve(key) {
    // Check for circular dependencies
    if (this.resolving.has(key)) {
      throw new Error(`Circular dependency detected: ${key}`);
    }

    const registration = this.registrations.get(key);

    if (!registration) {
      throw new Error(`No registration found for: ${key}`);
    }

    // Return cached singleton if available
    if (registration.singleton && this.instances.has(key)) {
      return this.instances.get(key);
    }

    // Mark as resolving
    this.resolving.add(key);

    try {
      // Create instance
      const instance = registration.factory(this);

      // Cache if singleton
      if (registration.singleton) {
        this.instances.set(key, instance);
      }

      return instance;
    } finally {
      this.resolving.delete(key);
    }
  }
  // Check if registered
  has(key) {
    return this.registrations.has(key);
  }

  // Clear all instances (for testing)
  clearInstances() {
    this.instances.clear();
  }

  // Helper: Get constructor parameter names
  _getParamNames(func) {
    const fnStr = func.toString();
    const match =
      fnStr.match(/constructor\s*\(([^)]*)\)/) ||
      fnStr.match(/function\s*.*?\(([^)]*)\)/);

    if (!match || !match[1]) return [];

    return match[1]
      .split(",")
      .map((param) => param.trim())
      .filter((param) => param.length > 0);
  }

  // Debug: Print all registrations
  debug() {
    console.log("\n📦 DI Container Contents:");
    for (const [key, reg] of this.registrations) {
      console.log(`  ${reg.singleton ? "🔒" : "🔄"} ${key}`);
    }
    console.log(`  Cached instances: ${this.instances.size}\n`);
  }
}
