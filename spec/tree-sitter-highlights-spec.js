const fs = require("fs");
const path = require("path");
const { Point } = require("lumine");

const HIGHLIGHTS_PATH = path.join(__dirname, "..", "grammars", "coffeescript-highlights.scm");

describe("CoffeeScript Tree-sitter highlights", () => {
  let editor;

  beforeEach(async () => {
    await lumine.packages.activatePackage("language-coffee-script");
  });

  afterEach(() => editor?.destroy());

  async function setUp(text) {
    editor = await lumine.workspace.open("parameters.coffee");
    editor.setText(text);
    await editor.getBuffer().languageMode.ready;
  }

  function rawCaptures(startRow, endRow) {
    const layer = editor.getBuffer().languageMode.rootLanguageLayer;
    return layer.queries.highlightsQuery.captures(layer.tree.rootNode, {
      startPosition: new Point(startRow, 0),
      endPosition: new Point(endRow, 0),
    });
  }

  it("preserves direct and instance parameter scopes", async () => {
    const source = "fn = (direct, @member) -> null";
    await setUp(source);

    const scopesAt = (needle) => {
      const column = source.indexOf(needle);
      return editor.scopeDescriptorForBufferPosition([0, column]).getScopesArray();
    };
    expect(scopesAt("direct")).toContain("variable.parameter.coffee");
    expect(scopesAt("member")).toContain("variable.parameter.coffee");
  });

  it("keeps a 6000-parameter parent leaf-rooted with local tile captures", async () => {
    const parameters = Array.from(
      { length: 6000 },
      (_, index) => `parameter_${index} = """\r\nvalue_${index}\r\n"""`,
    );
    await setUp(`generated = (${parameters.join(", ")}) -> null`);
    expect(editor.getLastBufferRow()).toBe(12000);
    expect(editor.getBuffer().languageMode.tree.rootNode.hasError).toBe(false);

    const captures = rawCaptures(5997, 6003);
    const parameterCaptures = captures.filter(
      (capture) => capture.name === "variable.parameter.coffee",
    );
    expect(captures.length).toBeLessThanOrEqual(20);
    expect(new Set(parameterCaptures.map((capture) => capture.node.id)).size).toBe(3);
    expect(
      parameterCaptures.every(
        (capture) =>
          capture.node.startPosition.row >= 5997 && capture.node.startPosition.row < 6003,
      ),
    ).toBe(true);

    const query = fs.readFileSync(HIGHLIGHTS_PATH, "utf8");
    expect(query).toContain('(#is? test.typeAt "parent.parent parameter")');
    expect(query).toContain('(#is? test.typeAt "parent.parent.parent parameter")');
    expect(query).not.toMatch(/\(parameters\s+\(parameter/);
  });
});
