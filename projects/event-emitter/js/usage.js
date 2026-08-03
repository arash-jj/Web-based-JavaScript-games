import EventEmitter from "../event-emitter";

// DEMO: Basic usage
const emitter = new EventEmitter();

// Register a listener
emitter.on("data", (msg) => {
  console.log("Received:", msg);
});

// Once listener
emitter.once("connect", () => {
  console.log("Connected (only once)");
});

emitter.emit("data", "Hello");
emitter.emit("connect"); // Fires
emitter.emit("connect"); // Ignored

// Remove a specific listener
const handler = (val) => console.log("Value:", val);
emitter.on("update", handler);
emitter.off("update", handler);
