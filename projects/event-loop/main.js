console.log("🔵 1. Start of script (Synchronous)");

setTimeout(() => {
  console.log("🟠 4. Macrotask: setTimeout callback");
}, 0);

Promise.resolve().then(() => {
  console.log("🟢 3. Microtask: Promise.then() callback");
});

// Using queueMicrotask for a pure microtask
queueMicrotask(() => {
  console.log("🟢 3. Microtask: queueMicrotask callback");
});

console.log("🔵 2. End of script (Synchronous)");

// --- Output ---
// 🔵 1. Start of script (Synchronous)
// 🔵 2. End of script (Synchronous)
// 🟢 3. Microtask: Promise.then() callback
// 🟢 3. Microtask: queueMicrotask callback
// 🟠 4. Macrotask: setTimeout callback


/**
 * Why this happens: The two console.log statements are synchronous and run
 * first. Then, the event loop processes the entire microtask queue (the Promise and
 * queueMicrotask callbacks). Only after the microtask queue is empty does it pick
 * he single setTimeout macrotask.
 */