const fs = require("fs");
const path = require("path");
const inspection = require.resolve("./helpers/syntax-inspection");
const rootSummary = (editor, types = []) => editor.analyzeSyntax(inspection, "root", { types });
const scopesAt = (editor, position) => editor.analyzeSyntax(inspection, "scopes", { position });

const packagePath = (name) => {
  const sibling = path.resolve(__dirname, "..", "..", name);
  return fs.existsSync(sibling) ? sibling : name;
};

describe("CoffeeScript Tree-sitter grammars", () => {
  beforeEach(async () => {
    await lumine.packages.activatePackage("language-html");
    await lumine.packages.activatePackage("language-javascript");
    await lumine.packages.activatePackage("language-coffee-script");
  });

  async function openFixture(name) {
    const editor = await lumine.workspace.open(path.join(__dirname, "fixtures", name));
    await editor.whenGrammarSettled();
    return editor;
  }

  it("parses and highlights CoffeeScript", async () => {
    const editor = await openFixture("sample.coffee");
    const root = await rootSummary(editor, ["class_definition"]);

    expect(editor.getGrammar().scopeName).toBe("source.coffee");
    expect(root.nodes.class_definition.length).toBe(2);
    expect(await scopesAt(editor, [0, 2])).toContain("comment.line.number-sign.coffee");
    expect(await scopesAt(editor, [20, 7])).toContain("entity.name.type.class.coffee");
  });

  it("parses Literate CoffeeScript and injects indented code", async () => {
    const editor = await openFixture("sample.litcoffee");

    expect(editor.getGrammar().scopeName).toBe("source.litcoffee");
    expect((await rootSummary(editor)).hasError).toBe(false);
    expect(await scopesAt(editor, [0, 1])).toContain("markup.heading.litcoffee");
    expect(await scopesAt(editor, [4, 5])).toContain("variable.other.coffee");
  });

  it("keeps code after a short HTML comment in Literate CoffeeScript", async () => {
    const editor = await lumine.workspace.open();
    try {
      editor.setGrammar(lumine.grammars.grammarForScopeName("source.litcoffee"));
      editor.setText("<!-->\n\n    square = (x) -> x * x\n");
      await editor.whenGrammarSettled();
      const root = await rootSummary(editor, ["indented_code_block"]);
      expect(root.hasError).toBe(false);
      expect(root.nodes.indented_code_block).toEqual(["    square = (x) -> x * x\n"]);
      expect(await scopesAt(editor, [2, 5])).toContain("variable.other.coffee");
    } finally {
      editor.destroy();
    }
  });

  it("routes CoffeeScript aliases to the matching dialect", () => {
    for (const alias of ["coffee", "coffee-script", "coffeescript", "cson"]) {
      expect(lumine.grammars.treeSitterGrammarForLanguageString(alias)?.scopeName).toBe(
        "source.coffee",
      );
    }
    expect(lumine.grammars.treeSitterGrammarForLanguageString("litcoffee")?.scopeName).toBe(
      "source.litcoffee",
    );
  });

  it("injects canonical languages into embedded source", async () => {
    await lumine.packages.activatePackage(packagePath("language-regex"));
    const editor = await lumine.workspace.open();
    try {
      editor.setGrammar(lumine.grammars.grammarForScopeName("source.coffee"));
      editor.setText(
        "html = ```html\n<h1>Heading</h1>\n```\njs = `const value = 1;`\npattern = /a+/\n",
      );
      await editor.whenGrammarSettled();
      expect(await editor.analyzeSyntax(inspection, "injectionScopes")).toEqual([
        "source.js",
        "source.regexp",
        "text.html.basic",
      ]);
    } finally {
      editor.destroy();
    }
  });
});
