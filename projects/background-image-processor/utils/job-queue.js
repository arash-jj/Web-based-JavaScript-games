import { Job } from "./job";
import { MinPriorityQueue } from "./priority-queue";
import { EventEmitter } from "events";

export class JobQueue extends EventEmitter {
  constructor(options = {}) {
    super();
    this.concurrency = options.concurrency || 1;
    this.retryBackoffBase = options.retryBackoffBase || 1000; // ms
    this.retryBackoffMultiplier = options.retryBackoffMultiplier || 2;
    this.maxRetries = options.maxRetries || 3;

    this.pendingQueue = new MinPriorityQueue(); // waiting jobs
    this.activeCount = 0;
    this.jobMap = new Map(); // id -> job for lookups
    this.paused = false;
  }

  /**
   * Add a job to the queue.
   * @param {string} id - unique identifier
   * @param {object} data - payload
   * @param {object} options - { priority, maxAttempts, process }
   */
  add(id, data, options) {
    if (this.jobMap.has(id)) throw new Error(`Job ${id} already exists`);

    const job = new Job(id, data, {
      ...options,
      maxAttempts: options.maxAttempts ?? this.maxRetries,
    });

    this.jobMap.set(id, job);
    this.pendingQueue.enqueue(job);

    this.emit("enqueued", job);
    this._processNext();
    return job;
  }

  /**
   * Start processing next jobs if concurrency allows.
   */
  _processNext() {
    if (this.paused) return;

    while (
      this.activeCount < this.concurrency &&
      !this.pendingQueue.isEmpty()
    ) {
      const job = this.pendingQueue.dequeue();
      this.activeCount++;
      this._executeJob(job);
    }
  }

  async _executeJob(job) {
    this.emit("active", job);

    try {
      await job.run();
      this.emit("completed", job);
      this.jobMap.delete(job.id);
    } catch (error) {
      job.error = error;
      if (job.attempts < job.maxAttempts) {
        // Exponential backoff + jitter
        const delay =
          this.retryBackoffBase *
          Math.pow(this.retryBackoffMultiplier, job.attempts - 1) *
          (0.5 + Math.random() * 0.5);
        this.emit("retrying", job, delay);

        setTimeout(() => {
          // Re‑enqueue with same priority (or optionally increase priority)
          job.status = "waiting";
          this.pendingQueue.enqueue(job);
          this._processNext();
        }, delay);
      } else {
        job.status = "failed";
        this.emit("failed", job);
        this.jobMap.delete(job.id);
      }
    } finally {
      this.activeCount--;
      this._processNext();
    }
  }

  /**
   * Pause processing (jobs still added, but not processed).
   */
  pause() {
    this.paused = true;
    this.emit("paused");
  }

  /**
   * Resume processing.
   */
  resume() {
    this.paused = false;
    this.emit("resumed");
    this._processNext();
  }

  /**
   * Get queue statistics.
   */
  getStats() {
    return {
      waiting: this.pendingQueue.size(),
      active: this.activeCount,
      completed: this.listenerCount("completed"), // rough
      failed: this.listenerCount("failed"),
    };
  }
}
