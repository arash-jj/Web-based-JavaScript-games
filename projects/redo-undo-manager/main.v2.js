/**
 * Version 2: Linked List-Based Snapshot Manager (Efficient)
 * This is perfect for scenarios where you need to maintain full snapshots (like a text editor or design tool).
 */

import { LinkedList } from "./utils";

class SnapshotManager {
  constructor(initialState) {
    // Use our linked list to store snapshots
    this.history = new LinkedList();
    this.current = null; // Points to current node

    // Create initial snapshot
    if (initialState !== undefined) {
      const snapshot = {
        state: JSON.parse(JSON.stringify(initialState)),
        timestamp: Date.now(),
        description: "Initial state",
      };
      this.current = this.history.append(snapshot);
    }
  }

  // Save a new snapshot
  saveState(state, description = "State saved") {
    // Discard any redo history (all nodes after current)
    if (this.current && this.current.next) {
      // Remove all nodes after current
      let nextNode = this.current.next;
      while (nextNode) {
        const toRemove = nextNode;
        nextNode = nextNode.next;
        this.history.remove(toRemove);
      }
    }

    const snapshot = {
      state: JSON.parse(JSON.stringify(state)),
      timestamp: Date.now(),
      description,
    };

    this.current = this.history.append(snapshot);
    return this.current;
  }

  // Undo - move one step back
  undo() {
    if (!this.current || !this.current.prev) {
      console.log("At beginning of history");
      return null;
    }
    this.current = this.current.prev;
    return this.current.data.state;
  }

  // Redo - move one step forward
  redo() {
    if (!this.current || !this.current.next) {
      console.log("At end of history");
      return null;
    }
    this.current = this.current.next;
    return this.current.data.state;
  }

  // Get current state
  getCurrentState() {
    return this.current ? this.current.data.state : null;
  }

  // Get all snapshots (for debugging)
  getHistory() {
    const snapshots = [];
    let node = this.history.head;
    while (node) {
      snapshots.push({
        ...node.data,
        isCurrent: node === this.current,
      });
      node = node.next;
    }
    return snapshots;
  }

  // Get history size
  getSize() {
    return this.history.size;
  }
}

// Example: Text editor state
class TextEditor {
  constructor() {
    this.text = "";
    this.cursorPosition = 0;
    this.snapshotManager = new SnapshotManager(this.getState());
  }

  getState() {
    return { text: this.text, cursor: this.cursorPosition };
  }

  restoreState(state) {
    this.text = state.text;
    this.cursorPosition = state.cursor;
  }

  type(text) {
    this.text += text;
    this.cursorPosition = this.text.length;
    // Auto-save state after change
    this.snapshotManager.saveState(this.getState(), `Typed: "${text}"`);
  }

  delete() {
    if (this.text.length > 0) {
      const deleted = this.text[this.text.length - 1];
      this.text = this.text.slice(0, -1);
      this.cursorPosition = this.text.length;
      this.snapshotManager.saveState(this.getState(), `Deleted: "${deleted}"`);
    }
  }

  undo() {
    const state = this.snapshotManager.undo();
    if (state) {
      this.restoreState(state);
      return true;
    }
    return false;
  }

  redo() {
    const state = this.snapshotManager.redo();
    if (state) {
      this.restoreState(state);
      return true;
    }
    return false;
  }

  getHistory() {
    return this.snapshotManager.getHistory();
  }
}

// Usage
const editor = new TextEditor();
editor.type("Hello");
editor.type(" World");
editor.type("!");
console.log(editor.text); // "Hello World!"

editor.undo(); // Undo "!"
console.log(editor.text); // "Hello World"

editor.undo(); // Undo " World"
console.log(editor.text); // "Hello"

editor.redo(); // Redo " World"
console.log(editor.text); // "Hello World"

console.log(editor.getHistory());
// Shows all snapshots with timestamps and which is current
