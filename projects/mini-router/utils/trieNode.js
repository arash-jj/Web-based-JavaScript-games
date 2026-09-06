class TrieNode {
  constructor() {
    this.children = new Map(); // char -> TrieNode
    this.isEndOfPath = false;
    this.handler = null; // The route handler function
    this.paramName = null; // For dynamic segments like :id
    this.isDynamic = false;
  }
}

export class RouterTrie {
  constructor() {
    this.root = new TrieNode();
  }

  // Insert a route pattern
  insert(path, handler) {
    const segments = this.parsePath(path);
    let node = this.root;

    for (const segment of segments) {
      // Check if this segment is dynamic (:id)
      const isDynamic = segment.startsWith(":");
      const key = isDynamic ? ":" : segment;

      if (!node.children.has(key)) {
        const child = new TrieNode();
        child.isDynamic = isDynamic;
        if (isDynamic) {
          child.paramName = segment.slice(1);
        }
        node.children.set(key, child);
      }

      node = node.children.get(key);
    }

    node.isEndOfPath = true;
    node.handler = handler;
  }

  // Match a URL path to a handler
  match(path) {
    const segments = this.parsePath(path);
    let node = this.root;
    const params = {};

    for (const segment of segments) {
      // Try exact match first
      if (node.children.has(segment)) {
        node = node.children.get(segment);
        continue;
      }

      // Try dynamic match
      if (node.children.has(":")) {
        const dynamicNode = node.children.get(":");
        params[dynamicNode.paramName] = segment;
        node = dynamicNode;
        continue;
      }

      // No match found
      return null;
    }

    if (node.isEndOfPath) {
      return { handler: node.handler, params };
    }

    return null; // Path not found
  }

  parsePath(path) {
    return path.split("/").filter((segment) => segment.length > 0);
  }
}
