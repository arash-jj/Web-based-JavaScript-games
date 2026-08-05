export class MinPriorityQueue {
  constructor() {
    this.heap = [];
  }

  size() {
    return this.heap.length;
  }
  isEmpty() {
    return this.heap.length === 0;
  }

  enqueue(job) {
    this.heap.push(job);
    this._bubbleUp(this.heap.length - 1);
  }

  dequeue() {
    if (this.isEmpty()) return null;
    const min = this.heap[0];
    const last = this.heap.pop();

    if (!this.isEmpty()) {
      this.heap[0] = last;
      this._bubbleUp(0);
    }
    return min;
  }

  peek() {
    return this.heap[0] || null;
  }

  _bubbleUp(index) {
    while (index > 0) {
      const parent = Math.floor((index - 1) / 2);
      if (this.heap[index].priority < this.heap[parent].priority) {
        [this.heap[index], this.heap[parent]] = [
          this.heap[parent],
          this.heap[index],
        ];
        index = parent;
      } else break;
    }
  }

  _bubbleDown(index) {
    const length = this.heap.length;
    while (true) {
      let smallest = index;
      const left = 2 * index + 1;
      const right = 2 * index + 2;
      if (
        left < length &&
        this.heap[left].priority < this.heap[smallest].priority
      )
        smallest = left;
      if (
        right < length &&
        this.heap[right].priority < this.heap[smallest].priority
      )
        smallest = right;
      if (smallest !== index) {
        [this.heap[index], this.heap[smallest]] = [
          this.heap[smallest],
          this.heap[index],
        ];
        index = smallest;
      } else break;
    }
  }
}
