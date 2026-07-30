import { CodeGenerator, HELPERS, Lexer, Parser } from ".";

export class TemplateEngine {
  constructor() {
    this.compiledTemplates = new Map();
  }

  compile(templateString) {
    // Step 1: Lex (tokenize)
    const lexer = new Lexer(templateString);
    const tokens = lexer.tokenize();

    // Step 2: Parse (build AST)
    const parser = new Parser(tokens);
    const ast = parser.parse();

    // Step 3: Generate code
    const generator = new CodeGenerator(ast);
    const functionBody = HELPERS + generator.generate();

    // Step 4: Create render function
    const renderFn = new Function("data", functionBody);

    // Cache for reuse
    const cacheKey = this.hash(templateString);
    this.compiledTemplates.set(cacheKey, renderFn);

    return renderFn;
  }

  render(templateString, data) {
    const cacheKey = this.hash(templateString);

    let renderFn;
    if (this.compiledTemplates.has(cacheKey)) {
      renderFn = this.compiledTemplates.get(cacheKey);
    } else {
      renderFn = this.compile(templateString);
    }

    return renderFn(data);
  }

  hash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash.toString();
  }

  // Debug: See generated code
  showGeneratedCode(templateString) {
    const lexer = new Lexer(templateString);
    const tokens = lexer.tokenize();
    const parser = new Parser(tokens);
    const ast = parser.parse();
    const generator = new CodeGenerator(ast);

    console.log("═".repeat(60));
    console.log("TEMPLATE:");
    console.log(templateString);
    console.log("\nTOKENS:");
    console.log(JSON.stringify(tokens, null, 2));
    console.log("\nAST:");
    console.log(JSON.stringify(ast, null, 2));
    console.log("\nGENERATED CODE:");
    console.log(HELPERS + generator.generate());
    console.log("═".repeat(60));
  }
}
