/**
 * Version 1: Stack-Based Undo/Redo (Simple like Redux)
 */

class CommandManager {
  constructor() {
    this.undoStack = [];
    this.redoStack = [];
    this.maxHistory = 100; // prevent memory leaks
  }

  // Execute a command and save it for undo
  execute(command) {
    // Clear redo stack when new action is performed
    this.redoStack = [];

    // Push command to undo stack
    this.undoStack.push(command);

    // Execute the command
    command.execute();

    // Prune history if too large
    if (this.undoStack.length > this.maxHistory) {
      this.undoStack.shift();
    }
  }

  // Undo the last command
  undo() {
    if (this.undoStack.length === 0) {
      console.log("Nothing to undo");
      return;
    }
    const command = this.undoStack.pop();
    command.undo();
    this.redoStack.push(command);
  }

  // Redo the last undone command
  redo() {
    if (this.redoStack.length === 0) {
      console.log("Nothing to redo");
      return;
    }

    const command = this.redoStack.pop();
    command.execute();
    this.undoStack.push(command);
  }

  // Get history (for debugging)
  getHistory() {
    return this.undoStack.map((cmd) => cmd.description);
  }
}
