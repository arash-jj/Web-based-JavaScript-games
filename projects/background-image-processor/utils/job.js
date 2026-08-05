export class Job {
  constructor(id, data, options = {}) {
    this.id = id;
    this.data = data;
    this.priority = options.priority || 0; // lower number = higher priority
    this.attempts = 0;
    this.maxAttempts = options.maxAttempts || 3;
    this.status = "waiting"; // waiting, active, complete, failed
    this.createdAt = Date.now();
    this._process = options.process; // async function to execute
  }

  async run() {
    this.status = "active";
    this.attempts++;
    await this._process(this.data);
    this.status = "completed";
  }
}
