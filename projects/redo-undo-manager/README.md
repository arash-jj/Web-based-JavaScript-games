# Undo/Redo Systems with Data Structures

> Two powerful approaches to implementing undo/redo functionality: the Command Pattern with stacks, and a Snapshot Manager using a doubly linked list.

## 🎯 About

This project demonstrates two distinct patterns for building undo/redo systems in JavaScript applications. It includes reusable data structures (Stack, Queue, Node, LinkedList) and two complete implementations:

1. **Version 1: Command Pattern (Stack‑Based)** – each action is encapsulated as a command object that knows how to execute and undo itself. Uses two stacks (undo/redo) for O(1) operations.
2. **Version 2: Snapshot Manager (Linked List‑Based)** – stores full snapshots of application state in a doubly linked list, allowing efficient traversal and automatic pruning of redo history.

Both implementations are accompanied by real‑world examples: a CommandManager for general command‑based operations, and a TextEditor with automatic snapshotting on every change.

## ✨ Features

- **Data Structures Library** – reusable `Stack`, `Queue`, `Node`, and `LinkedList` classes
- **Command Pattern Implementation** – execute/undo/redo with history limits
- **Snapshot Manager** – full‑state snapshots with timestamps and descriptions
- **Linked List‑Based History** – O(1) append, remove, and traversal; automatic redo discard on new actions
- **Text Editor Demo** – interactive demonstration of undo/redo with text manipulation
- **Debugging Support** – `getHistory()` methods to inspect all states
- **Zero Dependencies** – pure JavaScript, works in Node.js and browsers

## 🎯 What You'll Learn

- **Undo/Redo Design Patterns** – command pattern vs. snapshot approach
- **Data Structure Selection** – when to use stacks vs. linked lists for history
- **Linked List Operations** – efficient insertion, deletion, and traversal with `prev`/`next` pointers
- **State Management** – deep cloning, immutability, and restoring snapshots
- **Command Encapsulation** – bundling execute/undo logic into objects
- **History Pruning** – limiting memory usage and discarding redo branches

## 🎮 How to Use

### Running the Demos

Both versions are self‑contained. You can run them directly:

```bash
node main.v1.js   // Command pattern demo
node main.v2.js   // Snapshot manager with text editor demo
```

### Version 1: Command Pattern (Stack‑Based)

```js
import { CommandManager } from "./main.v1.js";

const manager = new CommandManager();

// Define a command (example: add number)
class AddCommand {
  constructor(value) {
    this.value = value;
    this.description = `Add ${value}`;
  }
  execute() {
    /* modify state */
  }
  undo() {
    /* revert state */
  }
}

manager.execute(new AddCommand(5));
manager.undo(); // reverts
manager.redo(); // reapplies
```

### Version 2: Snapshot Manager (Linked List‑Based)

```js
import { SnapshotManager } from "./main.v2.js";

const sm = new SnapshotManager(initialState);
sm.saveState(newState, "Description");
const previousState = sm.undo();
const nextState = sm.redo();
console.log(sm.getHistory()); // array of snapshots with timestamps
```

### Text Editor Demo (built on Version 2)

```js
const editor = new TextEditor();
editor.type("Hello");
editor.type(" World");
editor.undo(); // removes ' World'
editor.redo(); // adds ' World' again
console.log(editor.text); // "Hello World"
```

## 🎨 Customization

### Extending the Command Pattern

- Add a `maxHistory` limit to prevent memory bloat.
- Implement batch commands (group multiple actions).
- Add asynchronous commands with `async execute()`.

### Enhancing the Snapshot Manager

- Compress snapshots (e.g., store diffs instead of full states).
- Add a maximum number of snapshots and auto‑prune.
- Persist history to disk (e.g., using the cache utility from another project).

### Using the Data Structures Separately

The `utils` folder exports `Stack`, `Queue`, `Node`, and `LinkedList`. You can import them for your own projects:

```js
import { Stack, LinkedList } from "./utils/index.js";
```

## 📁 Project Structure

```text
redo-undo-manger/
├── main.v1.js                 # Command pattern (stack-based)
├── main.v2.js                 # Snapshot manager (linked list-based)
├── utils/
│   ├── index.js               # Re-exports all data structures
│   ├── stack.js               # Stack & Queue (array-based)
│   ├── linkedList.js          # Node & LinkedList (doubly linked)
│   └── (optional) ...         # Additional utilities
└── README.md                  # This file
```

## 🔧 API Reference

### Data Structures

| Class        | Description                                                                                      |
| ------------ | ------------------------------------------------------------------------------------------------ |
| `Stack`      | LIFO operations: `push`, `pop`, `peek`, `isEmpty`, `size`, `clear`                               |
| `Queue`      | FIFO operations: `enqueue`, `dequeue`, `peek`, `isEmpty`, `size`, `clear`                        |
| `Node`       | Doubly linked list node with `data`, `prev`, `next`                                              |
| `LinkedList` | Doubly linked list with `append`, `prepend`, `insertAfter`, `remove`, `clear`, `toArray`, `find` |

### CommandManager (Version 1)

- `execute(command)` – runs `command.execute()` and pushes to undo stack (clears redo)
- `undo()` – pops last command and calls its `undo()`, pushes to redo
- `redo()` – pops from redo, calls `execute()` and pushes to undo
- `getHistory()` – returns descriptions of all commands in undo stack

### SnapshotManager (Version 2)

- `constructor(initialState)` – creates initial snapshot
- `saveState(state, description)` – appends new snapshot, discards redo history
- `undo()` – moves `current` pointer back, returns state or `null`
- `redo()` – moves `current` forward, returns state or `null`
- `getCurrentState()` – returns state of current snapshot
- `getHistory()` – array of all snapshots with `isCurrent` flag
- `getSize()` – total number of snapshots

### TextEditor (built on Version 2)

- `type(text)` – appends text, auto‑saves snapshot
- `delete()` – removes last character, auto‑saves
- `undo()` / `redo()` – restore previous/next states
- `getHistory()` – delegate to SnapshotManager

## 🚀 Run Locally

### Node.js

```bash
node main.v1.js   # Command pattern demo
node main.v2.js   # Snapshot manager demo
```

### In the Browser

Use a bundler (Vite, Webpack) or import as ES modules with `<script type="module">`. All code is browser‑compatible.

## 📝 License

MIT License – free to use, modify, and distribute.

---
