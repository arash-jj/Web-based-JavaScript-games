import { DIcontainer } from "./container";
import {
  Application,
  CacheService,
  DatabaseService,
  EmailService,
  LoggerService,
  UserRepository,
  UserService,
} from "./services";

// Container SETUP
function createAppContainer() {
  const container = new DIcontainer();

  // Register configuration
  container.registerValue("config", {
    database: {
      host: "localhost",
      port: 5432,
      database: "myapp",
    },
    email: {
      apiKey: "sk-abc123",
      provider: "sendgrid",
    },
    logger: {
      appName: "MyApp",
      logLevel: "debug",
    },
    cache: {
      cacheTTL: 3600000,
    },
  });
  // Register services
  container.register(
    "logger",
    (c) => {
      const config = c.resolve("config");
      return new LoggerService(config.logger);
    },
    { singleton: true },
  );

  container.register(
    "database",
    (c) => {
      const config = c.resolve("config");
      return new DatabaseService(config.database);
    },
    { singleton: true },
  );

  container.register(
    "emailService",
    (c) => {
      const config = c.resolve("config");
      const logger = c.resolve("logger");
      return new EmailService(config.email, logger);
    },
    { singleton: true },
  );

  container.register(
    "cache",
    (c) => {
      const config = c.resolve("config");
      return new CacheService(config.cache);
    },
    { singleton: true },
  );

  container.register(
    "userRepository",
    (c) => {
      const database = c.resolve("database");
      const cache = c.resolve("cache");
      const logger = c.resolve("logger");
      return new UserRepository(database, cache, logger);
    },
    { singleton: true },
  );

  container.register(
    "userService",
    (c) => {
      const userRepository = c.resolve("userRepository");
      const emailService = c.resolve("emailService");
      const logger = c.resolve("logger");
      return new UserService(userRepository, emailService, logger);
    },
    { singleton: true },
  );

  return container;
}

// Run application

async function runApp() {
  const container = createAppContainer();
  const app = new Application(container);

  try {
    await app.bootstrap();

    const userService = container.resolve("userService");

    // Create a new user
    console.log("1️⃣  Creating user...");
    const user = await userService.createUser({
      name: "John Doe",
      email: "john@example.com",
      password: "hashedpassword",
    });
    console.log("Created:", user, "\n");

    // Get user
    console.log("2️⃣  Getting user...");
    const fetchedUser = await userService.getUser(user.id);
    console.log("Found:", fetchedUser, "\n");

    // Get user again (should hit cache)
    console.log("3️⃣  Getting user again (cached)...");
    const cachedUser = await userService.getUser(user.id);
    console.log("Found:", cachedUser, "\n");
  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    await app.shutdown();
  }
}

runApp().catch(console.error);
