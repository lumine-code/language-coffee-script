function nodeData(node) {
  return {
    id: node.id,
    text: node.text,
    range: node.range,
    startPosition: node.startPosition,
  };
}

function captureData(capture) {
  return {
    name: capture.name,
    node: nodeData(capture.node),
    setProperties: capture.setProperties,
  };
}

exports.root = (context, { types = [] } = {}) => {
  const root = context.getRootSyntaxNode();
  return {
    hasError: root?.hasError ?? null,
    nodes: Object.fromEntries(
      types.map((type) => [type, root?.descendantsOfType(type).map((node) => node.text) ?? []]),
    ),
  };
};

exports.injectionScopes = (context) =>
  context
    .getLanguageLayers()
    .filter(({ scopeName }) => scopeName !== context.getGrammar().scopeName)
    .map(({ scopeName }) => scopeName)
    .sort();

exports.scopes = (context, { position }) =>
  context.scopeDescriptorForBufferPosition(position).getScopesArray();

exports.tags = async (context) =>
  (await context.getGrammarQueryCaptureGroups("tagsQuery")).map(({ grammar, captures }) => ({
    grammar: { scopeName: grammar.scopeName },
    captures: captures.map(captureData),
  }));

exports.rawHighlights = async (context, { startRow, endRow }) => {
  const query = await context.getGrammar().getQuery("highlightsQuery");
  return query
    .captures(context.getRootSyntaxNode(), {
      startPosition: new context.Point(startRow, 0),
      endPosition: new context.Point(endRow, 0),
    })
    .map(captureData);
};
