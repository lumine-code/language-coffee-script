describe("language-coffee-script editing defaults", () => {
  let editor;
  beforeEach(async () => {
    jasmine.useRealClock();
    await lumine.packages.activatePackage("language-source");
    await lumine.packages.activatePackage("language-coffee-script");

    editor = await lumine.workspace.open();
    editor.setGrammar(lumine.grammars.grammarForScopeName("source.litcoffee"));
    editor.setText("A paragraph.");
    await editor.whenGrammarSettled();
  });
  afterEach(() => editor?.destroy());

  it("uses the correct comment operation in source.litcoffee", async () => {
    editor.setGrammar(lumine.grammars.grammarForScopeName("source.litcoffee"));
    editor.setText("A paragraph.");
    await editor.whenGrammarSettled();
    await editor.toggleLineCommentsForBufferRows(0, editor.getLastBufferRow());
    await editor.whenGrammarSettled();
    expect(editor.getText()).toBe("<!-- A paragraph. -->");
    await editor.toggleLineCommentsForBufferRows(0, editor.getLastBufferRow());
    await editor.whenGrammarSettled();
    expect(editor.getText()).toBe("A paragraph.");
  });

  it("provides real block delimiters to snippet and comment consumers", async () => {
    const delimiters = await editor.getCommentDelimitersForBufferPosition([0, 0]);
    expect(delimiters.block).toEqual(["<!--", "-->"]);
  });

  it("keeps hash comments inside injected CoffeeScript code", async () => {
    editor.setText("A paragraph.\n\n    square = (x) -> x * x\n");
    await editor.whenGrammarSettled();
    await editor.toggleLineCommentsForBufferRows(2, 2);
    await editor.whenGrammarSettled();
    expect(editor.lineTextForBufferRow(2)).toBe("    # square = (x) -> x * x");
  });
});
