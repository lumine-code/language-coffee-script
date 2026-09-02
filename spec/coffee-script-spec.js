const path = require("path");

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
    const languageMode = editor.getBuffer().getLanguageMode();

    expect(editor.getGrammar().scopeName).toBe("source.coffee");
    expect(languageMode.tree.rootNode.descendantsOfType("class_definition").length).toBe(2);
    expect(editor.scopeDescriptorForBufferPosition([0, 2]).getScopesArray()).toContain(
      "comment.line.number-sign.coffee",
    );
    expect(editor.scopeDescriptorForBufferPosition([20, 7]).getScopesArray()).toContain(
      "entity.name.type.class.coffee",
    );
  });

  it("parses Literate CoffeeScript and injects indented code", async () => {
    const editor = await openFixture("sample.litcoffee");
    const languageMode = editor.getBuffer().getLanguageMode();

    expect(editor.getGrammar().scopeName).toBe("source.litcoffee");
    expect(languageMode.tree.rootNode.hasError).toBe(false);
    expect(editor.scopeDescriptorForBufferPosition([0, 1]).getScopesArray()).toContain(
      "markup.heading.litcoffee",
    );
    expect(editor.scopeDescriptorForBufferPosition([4, 5]).getScopesArray()).toContain(
      "variable.other.coffee",
    );
  });

  it("registers canonical embedded-language targets", () => {
    const registrations = [];
    const previous = lumine.grammars.addInjectionPoint;
    lumine.grammars.addInjectionPoint = (scopeName, options) => {
      registrations.push({ scopeName, options });
      return { dispose() {} };
    };

    try {
      require("../lib/main").activate();
    } finally {
      lumine.grammars.addInjectionPoint = previous;
    }

    const targets = new Map(
      registrations.map(({ scopeName, options }) => [
        `${scopeName}:${options.type}`,
        options.language({ descendantsOfType: () => [] }),
      ]),
    );
    expect(targets.get("source.coffee:embedded_html")).toBe("html");
    expect(targets.get("source.coffee:embedded_js")).toBe("javascript");
    expect(targets.get("source.coffee:regex")).toBe("regex");
    expect(targets.get("source.litcoffee:indented_code_block")).toBe("coffeescript");
  });
});
