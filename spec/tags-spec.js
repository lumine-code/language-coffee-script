const path = require("path");
const fs = require("fs");

const packagePath = (name) => {
  const sibling = path.resolve(__dirname, "..", "..", name);
  return fs.existsSync(sibling) ? sibling : name;
};
const fixtures = require("./fixtures/symbols.json");

describe("language-coffee-script buffer symbol queries", () => {
  let grammars;
  let editor;

  beforeEach(async () => {
    jasmine.useRealClock();
    const pack = await lumine.packages.activatePackage(path.resolve(__dirname, ".."));
    grammars = pack.grammars;
  });

  afterEach(() => editor?.destroy());

  async function captures(scopeName, text) {
    const grammar = grammars.find((candidate) => candidate.scopeName === scopeName);
    expect(grammar).toBeDefined();
    editor = await lumine.workspace.open();
    editor.setGrammar(grammar);
    editor.setText(text);
    expect(editor.getPath()).toBeUndefined();
    expect(await editor.whenGrammarSettled()).toBe(true);
    const groups = await editor.getGrammarQueryCaptureGroups("tagsQuery");
    if (fixtures[scopeName]?.noSymbols) {
      expect(editor.hasGrammarQuery("tagsQuery")).toBe(false);
      expect(groups).toEqual([]);
      return [];
    }
    const scopes = fixtures[scopeName]?.injectedScopes ?? [scopeName];
    const matching = groups.filter(({ grammar }) => scopes.includes(grammar.scopeName));
    expect(matching.length).toBe(scopes.length);
    return matching.flatMap(({ captures }) => captures);
  }

  function expectSymbol(result, symbol) {
    const candidates = result
      .filter(
        (capture) =>
          capture.name === "name" && capture.node.text === (symbol.captureText ?? symbol.name),
      )
      .map((capture) => ({
        capture,
        definition: result.find(
          (candidate) =>
            candidate.name === `definition.${symbol.tag}` &&
            candidate.node.range.containsRange(capture.node.range),
        ),
      }))
      .filter(
        ({ capture, definition }) =>
          definition || capture.setProperties?.["symbol.tag"] === symbol.tag,
      );
    expect(candidates.length).toBeGreaterThan(0, `${symbol.name} (${symbol.tag})`);
    for (const { capture, definition } of candidates) {
      expect(capture.node.range.isEmpty()).toBe(false);
      if (definition) {
        expect(definition.node.range.isEmpty()).toBe(false);
        expect(definition.node.startPosition.row).toBeLessThanOrEqual(
          capture.node.startPosition.row,
        );
      }
    }
  }

  for (const [scopeName, fixture] of Object.entries(fixtures)) {
    it(`finds useful ${scopeName} declarations without calls, comments or arguments`, async () => {
      const result = await captures(scopeName, fixture.text);
      for (const symbol of fixture.symbols) expectSymbol(result, symbol);
      const names = result
        .filter((capture) => capture.name === "name")
        .map(({ node }) => node.text);
      for (const absent of fixture.absent ?? []) expect(names).not.toContain(absent);
    });

    if (fixture.noSymbols) continue;

    it(`updates ${scopeName} symbols and positions in an unsaved buffer`, async () => {
      const result = await captures(scopeName, fixture.text);
      const symbol = fixture.symbols[0];
      const original = result.find(
        (capture) =>
          capture.name === "name" && capture.node.text === (symbol.captureText ?? symbol.name),
      );
      const before = { ...original.node.startPosition };
      const renamed = `${symbol.name}Updated`;
      editor.setText(`\n${fixture.text.split(symbol.name).join(renamed)}`);
      expect(await editor.whenGrammarSettled()).toBe(true);
      const groups = await editor.getGrammarQueryCaptureGroups("tagsQuery");
      const scopes = fixture.injectedScopes ?? [scopeName];
      const current = groups
        .filter(({ grammar }) => scopes.includes(grammar.scopeName))
        .flatMap(({ captures }) => captures);
      const renamedSymbol = {
        ...symbol,
        name: renamed,
        captureText: symbol.captureText?.split(symbol.name).join(renamed),
      };
      expectSymbol(current, renamedSymbol);
      const next = current.find(
        (capture) =>
          capture.name === "name" && capture.node.text === (renamedSymbol.captureText ?? renamed),
      );
      expect(next.node.startPosition.row).toBe(before.row + 1);
      expect(next.node.startPosition.column).toBe(before.column);
      expect(
        current.some(
          (capture) =>
            capture.name === "name" && capture.node.text === (symbol.captureText ?? symbol.name),
        ),
      ).toBe(false);
    });
  }
  it("classifies named arrows once and omits calls and anonymous arrows", async () => {
    const result = await captures("source.coffee", "formatter = (value) -> value");
    expectSymbol(result, { name: "formatter", tag: "function" });
    expect(result.filter(({ name }) => name === "name").map(({ node }) => node.text)).toEqual([
      "formatter",
    ]);
    editor.destroy();
    const anonymous = await captures("source.coffee", "items.map (value) -> value");
    expect(anonymous.filter(({ name }) => name === "name")).toEqual([]);
  });

  it("includes injected CoffeeScript declarations in a literate buffer", async () => {
    await lumine.packages.activatePackage(packagePath("language-html"));
    const grammar = grammars.find(({ scopeName }) => scopeName === "source.litcoffee");
    editor = await lumine.workspace.open();
    editor.setGrammar(grammar);
    editor.setText("A literate example.\n\n    greet = (name) -> name\n");
    expect(await editor.whenGrammarSettled()).toBe(true);
    const groups = await editor.getGrammarQueryCaptureGroups("tagsQuery");
    const coffee = groups.find(({ grammar }) => grammar.scopeName === "source.coffee");
    expect(coffee).toBeDefined();
    expectSymbol(coffee.captures, { name: "greet", tag: "function" });
    expect(coffee.captures.find(({ name }) => name === "name").node.startPosition.row).toBe(2);
  });
});
