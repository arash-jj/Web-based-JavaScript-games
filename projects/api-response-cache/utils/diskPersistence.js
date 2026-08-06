import fs from "fs";
import path from "path";

export class DiskPersister {
  constructor(filePath) {
    this.filePath = filePath;
  }

  async save(data) {
    const dir = path.dirname(this.filePath);
    await fs.promises.mkdir(dir, { recursive: true });
    // Write to a temporary file and rename for atomicity
    const tmpPath = this.filePath + ".tmp";
    await fs.promises.writeFile(tmpPath, JSON.stringify(data, null, 2));
    await fs.promises.rename(tmpPath, this.filePath);
  }

  async load() {
    try {
      const raw = await fs.promises.readFile(this.filePath, "utf8");
      return JSON.parse(raw);
    } catch (err) {
      if (err.code === "ENOENT") return {}; // first start
      throw err;
    }
  }
}
