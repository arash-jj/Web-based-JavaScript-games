export class CodeGenerator {
  constructor(ast) {
    this.ast = ast;
  }

  generate() {
    let code = "";

    code += 'let __output = "";\n';
    code += this.generateNode(this.ast);
    code += "return __output;\n";

    return code;
  }

  generateNode(node) {
    switch (node.type) {
      case "Program":
        return this.generateProgram(node);
      case "Text":
        return this.generateText(node);
      case "Variable":
        return this.generateVariable(node);
      case "IfBlock":
        return this.generateIfBlock(node);
      case "EachBlock":
        return this.generateEachBlock(node);
      default:
        throw new Error(`Unknown node type: ${node.type}`);
    }
  }

  generateProgram(node) {
    return node.body.map((child) => this.generateNode(child)).join("");
  }

  generateText(node) {
    // Escape quotes and newlines
    const escaped = node.value
      .replace(/\\/g, "\\\\")
      .replace(/"/g, '\\"')
      .replace(/\n/g, "\\n");
    return `__output += "${escaped}";\n`;
  }

  generateVariable(node) {
    return `__output += escape(getValue(data, "${node.name}"));\n`;
  }

  generateIfBlock(node) {
    let code = "";
    code += `if (getValue(data, "${node.condition}")) {\n`;
    code += node.body.map((child) => this.generateNode(child)).join("");
    code += "}\n";
    return code;
  }

  generateEachBlock(node) {
    let code = "";
    code += `const __iterable = getValue(data, "${node.iterable}");\n`;
    code += "if (__iterable && __iterable.length) {\n";
    code +=
      "  for (let __index = 0; __index < __iterable.length; __index++) {\n";
    code += "    const __item = __iterable[__index];\n";
    code += "    const __current  = __item;\n"; // Support {{this}}

    node.body.forEach((child) => {
      code += "    " + this.generateNode(child);
    });

    code += "  }\n";
    code += "}\n";
    return code;
  }
}


export const HELPERS = `
function escape(str) {
    if (str == null) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function getValue(obj, path) {
    if (obj == null) return '';
    const keys = path.split('.');
    let current = obj;
    
    for (const key of keys) {
        if (current == null) return '';
        current = current[key];
    }
    
    return current;
}`;