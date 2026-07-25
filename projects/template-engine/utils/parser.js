import { Lexer } from "./lexer";

export class Parser {
  constructor(tokens) {
    this.tokens = tokens;
    this.position = 0;
  }

  parse() {
    return this.parseProgram();
  }

  parseProgram() {
    const body = [];

    while (this.position < this.tokens.length) {
      body.push(this.parseStatement());
    }

    return {
      type: "Program",
      body,
    };
  }

  parseStatement() {
    const token = this.current();

    switch (token.type) {
      case "TEXT":
        this.position++;
        return {
          type: "TEXT",
          value: token.value,
        };
      case "VARIABLE":
        this.position++;
        return {
          type: "Variable",
          name: token.name,
        };

      case "IF_START":
        return this.parseIfBlock();

      case "EACH_START":
        return this.parseEachBlock();

      default:
        throw new Error(`Unexpected token: ${token.type}`);
    }
  }

  parseIfBlock() {
    const startToken = this.current();
    this.position++; // Consume IF_START

    const body = [];

    // Parse body IF_END
    while (
      this.position < this.tokens.length &&
      this.current().type !== "IF_END"
    ) {
      body.push(this.parseStatement());
    }

    // Consume IF_END

    if (this.current()?.type === "IF_END") {
      this.position++;
    } else {
      throw new Error("EXpected {{/if}}");
    }

    return {
      type: "IfBlock",
      condition: startToken.condition,
      body,
    };
  }

  parseEachBlock() {
    const startToken = this.current();
    this.position++; // Consume EACH_START

    const body = [];

    // Parse body until EACH_END
    while (
      this.position < this.tokens.length &&
      this.current().type !== "EACH_END"
    ) {
      body.push(this.parseStatement());

      // Consume EACH_END
      if (this.current()?.type === "EACH_END") {
        this.position++;
      } else {
        throw new Error("Expected {{/each}}");
      }
    }
    return {
      type: "EachBlock",
      iterable: startToken.iterable,
      body: body,
    };
  }
  current() {
    return this.tokens[this.position];
  }
}

// DEMO: AST Visualization
function demoParser() {
  const template = `
        <h1>Hello {{name}}!</h1>
        {{#if isActive}}
            <p>Active user</p>
        {{/if}}
    `;

  const lexer = new Lexer(template);
  const tokens = lexer.tokenize();
  const parser = new Parser(tokens);
  const ast = parser.parse();

  console.log("AST:");
  console.log(JSON.stringify(ast, null, 2));

  return ast;
}

demoParser();
