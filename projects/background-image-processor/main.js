import { JobQueue } from "./utils/job-queue";

// Image processing simulation
async function processImage(imageData) {
  console.log(`🖼️  Processing ${imageData.name}...`);
  // Simulate work (0.5–2 seconds)
  await new Promise((resolve) =>
    setTimeout(resolve, Math.random() * 1500 + 500),
  );

  // Simulate random failures (30% chance)
  if (Math.random() < 0.3) {
    throw new Error("Processing failed due to network glitch");
  }

  // Success
  console.log(`✅ ${imageData.name} processed successfully`);
  return { output: `output/${imageData.name}` };
}

// Create the job queue
const imageQueue = new JobQueue({
  concurrency: 3,
  retryBackoffBase: 1000, // start at 1 second
  retryBackoffMultiplier: 2, // 1s, 2s, 4s ...
  maxRetries: 3,
});

// Listen to events (decoupled monitoring)
imageQueue.on("enqueued", (job) => {
  console.log(`📌 Job ${job.id} enqueued with priority ${job.priority}`);
});

imageQueue.on("active", (job) => {
  console.log(`⚡ Job ${job.id} started (attempt ${job.attempts})`);
});

imageQueue.on("completed", (job) => {
  console.log(`🏁 Job ${job.id} completed!`);
});

imageQueue.on("retrying", (job, delay) => {
  console.log(
    `🔄 Job ${job.id} will retry in ${delay.toFixed(0)}ms (attempt ${job.attempts})`,
  );
});

imageQueue.on("failed", (job) => {
  console.log(
    `❌ Job ${job.id} permanently failed after ${job.attempts} attempts`,
  );
});

// Add some jobs with different priorities (lower = more urgent)
const images = [
  { name: "hero-banner.jpg", priority: 1 },
  { name: "user-avatar.png", priority: 5 },
  { name: "product-thumb.jpg", priority: 3 },
  { name: "footer-logo.png", priority: 10 },
  { name: "blog-header.jpg", priority: 2 },
  { name: "about-team.jpg", priority: 4 },
];

images.forEach((img, i) => {
  imageQueue.add(img.name, img, {
    priority: img.priority,
    process: (data) => processImage(data),
  });
});

// To run: node/bun main.js
// You'll see jobs processed in priority order (lower numbers first),
// maximum 3 at a time, retried with exponential backoff on failure.
