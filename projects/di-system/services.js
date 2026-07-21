// UTILS

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// SERVICES

// Database Service
export class DatabaseService {
  constructor(config) {
    this.config = config;
    this.connected = false;
  }

  async connect() {
    if (this.connected) return;
    console.log(`🗄️  Connecting to ${this.config.host}:${this.config.port}...`);
    await sleep(100);
    this.connected = true;
    console.log("✅ Database connected");
  }

  async query(sql, params = []) {
    if (!this.connected) throw new Error("Database not connected");
    console.log(`🔍 Query: ${sql}`);
    // Simulate query
    return [{ id: 1, name: "John Doe", email: "john@example.com" }];
  }

  async insert(table, data) {
    if (!this.connected) throw new Error("Database not connected");
    console.log(`💾 Insert into ${table}:`, data);
    return { id: Date.now(), ...data };
  }

  async disconnect() {
    this.connected = false;
    console.log("🔌 Database disconnected");
  }
}

// Email Service
export class EmailService {
  constructor(config, logger) {
    this.apiKey = config.apiKey;
    this.provider = config.provider || "sendgrid";
    this.logger = logger;
  }

  async send({ to, subject, template, data }) {
    this.logger.log(`Sending ${template} email to ${to}`);
    console.log(`📧 [${this.provider}] To: ${to}, Subject: ${subject}`);
    await sleep(50);
    return { sent: true, messageId: `msg_${Date.now()}` };
  }

  async sendWelcome(user) {
    return this.send({
      to: user.email,
      subject: "Welcome!",
      template: "welcome",
      data: { name: user.name },
    });
  }
}

// Logger Service
export class LoggerService {
  constructor(config) {
    this.level = config.logLevel || "info";
    this.prefix = config.appName || "App";
  }

  log(message, data = {}) {
    console.log(`[${this.prefix}][INFO] ${message}`, data);
  }

  error(message, error) {
    console.error(`[${this.prefix}][ERROR] ${message}`, error);
  }

  warn(message) {
    console.warn(`[${this.prefix}][WARN] ${message}`);
  }

  debug(message) {
    if (this.level === "debug") {
      console.debug(`[${this.prefix}][DEBUG] ${message}`);
    }
  }
}

// Cache Service
export class CacheService {
  constructor(config) {
    this.store = new Map();
    this.defaultTTL = config.cacheTTL || 3600000; // 1 hour
  }

  async get(key) {
    const item = this.store.get(key);
    if (!item) return null;

    if (Date.now() > item.expiresAt) {
      this.store.delete(key);
      return null;
    }

    console.log(`💾 Cache hit: ${key}`);
    return item.value;
  }

  async set(key, value, ttl = this.defaultTTL) {
    console.log(`💾 Cache set: ${key}`);
    this.store.set(key, {
      value,
      expiresAt: Date.now() + ttl,
    });
  }

  async delete(key) {
    this.store.delete(key);
  }

  async clear() {
    this.store.clear();
  }
}

// User Repository
export class UserRepository {
  constructor(database, cache, logger) {
    this.database = database;
    this.cache = cache;
    this.logger = logger;
  }

  async findById(id) {
    // Try cache first
    const cached = await this.cache.get(`user:${id}`);
    if (cached) return cached;

    // Query database
    const results = await this.database.query(
      "SELECT * FROM users WHERE id = ?",
      [id],
    );

    if (results.length === 0) {
      throw new Error(`User ${id} not found`);
    }

    const user = results[0];

    // Cache result
    await this.cache.set(`user:${id}`, user);

    return user;
  }

  async create(userData) {
    const user = await this.database.insert("users", userData);
    this.logger.log("User created", { id: user.id });
    return user;
  }

  async findByEmail(email) {
    const results = await this.database.query(
      "SELECT * FROM users WHERE email = ?",
      [email],
    );
    return results[0] || null;
  }
}

// User Service (Business Logic)
export class UserService {
  constructor(userRepository, emailService, logger) {
    this.userRepository = userRepository;
    this.emailService = emailService;
    this.logger = logger;
  }

  async createUser(userData) {
    this.logger.log("Creating user", { email: userData.email });

    // Validate
    if (!userData.email || !userData.name) {
      throw new Error("Name and email are required");
    }

    // Check if exists
    const existing = await this.userRepository.findByEmail(userData.email);
    if (existing) {
      throw new Error("User already exists");
    }

    // Create user
    const user = await this.userRepository.create(userData);

    // Send welcome email
    await this.emailService.sendWelcome(user);

    this.logger.log("User created successfully", { id: user.id });

    return user;
  }

  async getUser(id) {
    this.logger.log("Getting user", { id });
    return this.userRepository.findById(id);
  }
}

// Application Bootstrap
export class Application {
  constructor(container) {
    this.container = container;
    this.services = {};
  }

  async bootstrap() {
    console.log("🚀 Bootstrapping application...\n");

    // Resolve services
    this.services.database = this.container.resolve("database");
    this.services.logger = this.container.resolve("logger");
    this.services.userService = this.container.resolve("userService");

    // Initialize connections
    await this.services.database.connect();
    this.services.logger.log("Application started");

    console.log("\n✅ Application ready!\n");
  }

  async shutdown() {
    console.log("\n🛑 Shutting down...");
    await this.services.database.disconnect();
    this.services.logger.log("Application stopped");
  }
}