class Node {
  constructor(data) {
    this.data = data;
    this.prev = null;
    this.next = null;
  }
}

class LinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
    this.size = 0;
  }

  // Add to end - O(1)
  append(data) {
    const node = new Node(data);
    if (!this.head) {
      this.head = node;
      this.tail = node;
    } else {
      this.tail.next = node;
      node.prev = this.tail;
      this.tail = node;
    }
    this.size++;
    return node;
  }

  // Add to begging - O(1)
  prepend(data) {
    const node = new Node(data);
    if (!this.head) {
      this.head = node;
      this.tail = node;
    } else {
      node.next = this.head;
      this.head.prev = node;
      this.head = node;
    }
    this.size++;
    return node;
  }

  // Insert after a specific node - O(1) if you have the node reference
  insertAfter(node, data) {
    if (!node) return null;
    const newNode = new Node(data);
    newNode.next = node.next;
    newNode.prev = node;

    if (node.next) {
      node.next.prev = newNode;
    } else {
      this.tail = newNode;
    }
    node.next = newNode;
    this.size++;
    return newNode;
  }

  // Remove a specific node - O(1) if you have the reference
  remove(node) {
    if (!node) return null;

    if (node.prev) {
      node.prev.next = node.next;
    } else {
      this.head = node.next;
    }

    if (node.next) {
      node.next.prev = node.prev;
    } else {
      this.tail = node.prev;
    }
    this.size--;
    return null;
  }

  // Clear all nodes
  clear() {
    this.head = null;
    this.tail = null;
    this.size = 0;
  }

  // Convert to array for debugging
  toArray() {
    const result = [];
    let current = this.head;
    while (current) {
      result.push(current.data);
      current = current.next;
    }
    return result;
  }

  // Find a node by value (used for testing)
  find(data) {
    let current = this.head;
    while (current) {
      if (current.data === data) return current;
      current = current.next;
    }
    return null;
  }
}
