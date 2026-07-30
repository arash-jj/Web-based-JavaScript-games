export class Lexer {
  constructor(template) {
    this.template = template;
    this.position = 0;
    this.tokens = [];
  }

  tokenize() {
    while (this.position < this.template.length) {
      // Check for template syntax
      if (this.peek(2) === "{{") {
        this.handleExpression();
      } else {
        this.handleText();
      }
    }
    return this.tokens;
  }

  handleText() {
    let text = "";
    let char = this.template[this.position];

    while (char && !this.isExpressionStart()) {
      text += char;
      this.position++;
      char = this.template[this.position];
    }

    if (text) {
      this.tokens.push({
        type: "TEXT",
        value: text,
      });
    }
  }

  handleExpression() {
    this.position += 2; // Skip '{{'

    // Skip whitespace
    this.skipWhitespace();

    // Check expression type

    switch (this.peek()) {
      case "#":
        this.handleBlockStart();
        break;
      case "/":
        this.handleBlockEnd();
      default:
        this.handleVariable();
        break;
    }
    // Expect closing '}}'
    this.expectClose();
  }
  handleVariable() {
    let expression = "";

    while (this.position < this.template.length && !this.isClose()) {
      expression += this.template[this.position];
      this.position++;
    }

    expression = expression.trim();

    // Check for each loop

    if (expression.startsWith("each ")) {
      const iterable = expression.substring(5).trim();
      this.tokens.push({
        type: "EACH_START",
        iterable: iterable,
      });
    } else if (expression.startsWith("if ")) {
      const condition = expression.substring(3).trim();
      this.tokens.push({
        type: "IF_START",
        condition: condition,
      });
    } else {
      this.tokens.push({
        type: "VARIABLE",
        name: expression,
      });
    }
  }
  handleBlockStart() {
    this.position++; // Skip '#'
    let blockType = "";

    while (this.position < this.template.length && !this.isClose()) {
      blockType += this.template[this.position];
      this.position++;
    }

    blockType = blockType.trim();

    if (blockType.startsWith("each ")) {
      const iterable = blockType.substring(5).trim();
      this.tokens.push({ type: "EACH_START", iterable });
    } else if (blockType.startsWith("if ")) {
      const condition = blockType.substring(3).trim();
      this.tokens.push({ type: "IF_START", condition });
    }
  }

  handleBlockEnd() {
    this.position++; // Skip '/'
    let blockType = "";

    while (this.position < this.template.length && !this.isClose()) {
      blockType += this.template[this.position];
      this.position++;
    }

    const type = blockType.trim();

    if (type === "each") {
      this.tokens.push({ type: "EACH_END" });
    } else if (type === "if") {
      this.tokens.push({ type: "IF_END" });
    }
  }

  expectClose() {
    if (this.peek(2) === "}}") {
      this.position += 2;
    } else {
      throw new Error(`Expected '}}' at position ${this.position}`);
    }
  }

  isExpressionStart() {
    return this.peek(2) === "{{";
  }

  isClose() {
    return this.peek(2) === "}}";
  }

  peek(count = 1) {
    if (this.position + count > this.template.length) return null;
    return this.template.substring(this.position, this.position + count);
  }

  skipWhitespace() {
    while (
      this.position < this.template.length &&
      this.template[this.position] === " "
    ) {
      this.position++;
    }
  }
}

// DEMO: Tokenizer in action
// function demoLexer() {
//   const template = `
//         <h1>Hello {{name}}!</h1>
//         {{#if isAdmin}}
//             <p>Admin Panel</p>
//         {{/if}}
//         <ul>
//         {{#each items}}
//             <li>{{this}}</li>
//         {{/each}}
//         </ul>
//     `;

//   const lexer = new Lexer(template);
//   const tokens = lexer.tokenize();

//   console.log("Tokens:");
//   tokens.forEach((token, i) => {
//     console.log(`  ${i}:`, token);
//   });

//   return tokens;
// }

// demoLexer();
