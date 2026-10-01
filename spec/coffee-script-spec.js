const fs = require("fs");
const path = require("path");

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
    await editor.languageMode.ready;
    return editor;
  }

  it("parses and highlights CoffeeScript", async () => {
    const editor = await openFixture("sample.coffee");
    const root = editor.getSyntaxNodeAtBufferPosition([0, 0], (node) => node.parent == null);

    expect(editor.getGrammar().scopeName).toBe("source.coffee");
    expect(root.descendantsOfType("class_definition").length).toBe(2);
    expect(editor.scopeDescriptorForBufferPosition([0, 2]).getScopesArray()).toContain(
      "comment.line.number-sign.coffee",
    );
    expect(editor.scopeDescriptorForBufferPosition([20, 7]).getScopesArray()).toContain(
      "entity.name.type.class.coffee",
    );
  });

  it("parses Literate CoffeeScript and injects indented code", async () => {
    const editor = await openFixture("sample.litcoffee");

    expect(editor.getGrammar().scopeName).toBe("source.litcoffee");
    expect(editor.getBuffer().getLanguageMode().rootLanguageLayer.tree.rootNode.hasError).toBe(
      false,
    );
    expect(editor.scopeDescriptorForBufferPosition([0, 1]).getScopesArray()).toContain(
      "markup.heading.litcoffee",
    );
    expect(editor.scopeDescriptorForBufferPosition([4, 5]).getScopesArray()).toContain(
      "variable.other.coffee",
    );
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
      await editor.languageMode.ready;
      await editor.languageMode.atGrammarSettlement();
      expect(
        editor.languageMode
          .getAllInjectionLayers()
          .map((layer) => layer.grammar.scopeName)
          .sort(),
      ).toEqual(["source.js", "source.regexp", "text.html.basic"]);
    } finally {
      editor.destroy();
    }
  });
});
