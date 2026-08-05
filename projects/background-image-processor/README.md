# Image-processor - Priority Job Queue with Retry & Backoff

> A job queue system with priority-based processing, concurrency control, exponential backoff retries, and event-driven monitoring.

## 🎯 About

This project implements a robust **job queue system** that processes tasks with priority ordering, configurable concurrency, and automatic retries with exponential backoff. It's designed for scenarios like background image processing, email delivery, file uploads, or any asynchronous workload where reliability and ordering matter.

The system consists of:

- **`Job`** – individual unit of work with metadata (status, attempts, priority)
- **`MinPriorityQueue`** – heap-based priority queue (lower numbers = higher priority)
- **`JobQueue`** – orchestrates job processing with concurrency limits, retry logic, and event emission

The demonstration simulates an image processing pipeline where jobs have different priorities (hero banner > blog header > product thumb, etc.), run with a concurrency of 3, and automatically retry failed jobs with exponential backoff (1s, 2s, 4s) up to 3 attempts.

## ✨ Features

- **Priority-based processing** – lower priority numbers execute first (0 = highest)
- **Concurrency control** – configurable number of jobs processed simultaneously
- **Exponential backoff retries** – retry failed jobs with increasing delays (with jitter)
- **Event-driven** – emits events for enqueue, active, complete, retry, and failure
- **Graceful pause/resume** – pause processing without losing queued jobs
- **Unique job IDs** – prevent duplicate job submissions
- **Statistics** – query queue state (waiting, active, completed, failed)
- **Fully tested** – includes random failure simulation to demonstrate retry logic

## 🎯 What You'll Learn

- **Priority queues** – implementing a min-heap data structure for priority ordering
- **Job scheduling** – managing work queues with concurrency constraints
- **Retry strategies** – exponential backoff with jitter for robust error recovery
- **Event-driven architecture** – decoupled monitoring using EventEmitter
- **Async workflow management** – coordinating asynchronous job execution
- **State management** – tracking job lifecycle (waiting → active → completed/failed)

## 🎮 How to Use

### Basic Usage

```js
import { JobQueue } from "./utils/job-queue.js";

const queue = new JobQueue({
  concurrency: 2,
  maxRetries: 3,
  retryBackoffBase: 1000,
  retryBackoffMultiplier: 2,
});

// Add a job
queue.add(
  "job-1",
  { name: "process-this" },
  {
    priority: 1,
    process: async (data) => {
      console.log("Processing:", data.name);
    },
  },
);

// Listen for events
queue.on("completed", (job) => {
  console.log(`Job ${job.id} finished!`);
});

queue.on("failed", (job) => {
  console.log(`Job ${job.id} failed after ${job.attempts} attempts`);
});
```

### Running the Demo

```bash
node main.js
```

You'll see jobs processed in priority order (lower numbers first), with up to 3 running concurrently. Failed jobs will retry with exponential backoff.

### Pause/Resume

```js
queue.pause(); // Stop processing
queue.resume(); // Resume processing
```

### Get Statistics

```js
const stats = queue.getStats();
console.log(stats);
// { waiting: 2, active: 1, completed: 3, failed: 0 }
```

## 🎨 Customization

### Concurrency

Adjust how many jobs run simultaneously:

```js
const queue = new JobQueue({ concurrency: 5 }); // process 5 at a time
```

### Retry Strategy

```js
const queue = new JobQueue({
  maxRetries: 5,
  retryBackoffBase: 500, // start at 500ms
  retryBackoffMultiplier: 3, // 500ms, 1500ms, 4500ms...
});
```

### Custom Process Function

Each job gets its own `process` function in options:

```js
queue.add(
  "email-1",
  { to: "user@example.com" },
  {
    priority: 2,
    process: async (data) => {
      await sendEmail(data.to, "Welcome!");
    },
  },
);
```

### Add Jitter to Retries

The implementation already includes jitter (random variation) to prevent thundering herd problems:

```js
const delay =
  backoffBase *
  Math.pow(backoffMultiplier, attempts - 1) *
  (0.5 + Math.random() * 0.5); // 50–100% of calculated delay
```

### Modify Priority Dynamically

During retries, you can increase priority (lower number) to process urgent retries faster. Modify in `_executeJob`:

```js
if (job.attempts < job.maxAttempts) {
  job.priority = Math.max(job.priority - 1, 0); // increase priority
  // re-enqueue...
}
```

## 📁 Project Structure

```text
background-image-processor/
├── main.js                     # Image processing demo
├── utils/
│   ├── index.js                # Re‑exports all modules
│   ├── job.js                  # Job class (job metadata)
│   ├── priority-queue.js       # Min-heap priority queue
│   ├── job-queue.js            # JobQueue orchestrator
│   └── (optional) ...          # Additional utilities
└── README.md                   # This file
```

## 🔧 API Reference

### `JobQueue(options)`

| Option                   | Default | Description                       |
| ------------------------ | ------- | --------------------------------- |
| `concurrency`            | `1`     | Max jobs processed simultaneously |
| `maxRetries`             | `3`     | Default retry attempts per job    |
| `retryBackoffBase`       | `1000`  | Initial delay (ms) for retries    |
| `retryBackoffMultiplier` | `2`     | Exponential factor for backoff    |

### `queue.add(id, data, options)`

| Option        | Default    | Description                                   |
| ------------- | ---------- | --------------------------------------------- |
| `priority`    | `0`        | Lower = higher priority                       |
| `maxAttempts` | `3`        | Max attempts for this job (overrides default) |
| `process`     | `required` | Async function `(data) => Promise`            |

### Events

- `enqueued(job)` – job added to queue
- `active(job)` – job started processing
- `completed(job)` – job finished successfully
- `retrying(job, delay)` – job failed, retrying after delay
- `failed(job)` – job permanently failed (exhausted attempts)
- `paused()` – queue paused
- `resumed()` – queue resumed

## 🚀 Run Locally

### In Node.js

```bash
node main.js
```

### In Bun

```bash
bun run main.js
```

### In the Browser

Use a bundler like Vite, Webpack, or import directly with `<script type="module">` (requires import map for Node.js modules like `events`).

## 📝 License

MIT License – free to use, modify, and distribute.
