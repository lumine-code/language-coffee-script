exports.activate = function () {
  lumine.grammars.addInjectionPoint("source.coffee", {
    type: "embedded_html",
    language: () => "html",
    content: (node) => node,
  });

  lumine.grammars.addInjectionPoint("source.coffee", {
    type: "embedded_js",
    language: () => "javascript",
    content: (node) => node,
  });

  lumine.grammars.addInjectionPoint("source.coffee", {
    type: "regex",
    language: () => "regex",
    content(node) {
      return node.descendantsOfType(["single_line_regex", "multi_line_regex"]);
    },
  });

  lumine.grammars.addInjectionPoint("source.litcoffee", {
    type: "indented_code_block",
    language: () => "coffeescript",
    content: (node) => node,
    includeChildren: true,
  });

  lumine.grammars.addInjectionPoint("source.litcoffee", {
    type: "html_block",
    language: () => "html",
    content: (node) => node,
    includeChildren: true,
  });
};

exports.consumeHyperlinkInjection = (hyperlink) => {
  hyperlink.addInjectionPoint("source.coffee", { types: ["comment"] });
  hyperlink.addInjectionPoint("source.litcoffee", { types: ["inline"] });
};

exports.consumeTodoInjection = (todo) => {
  todo.addInjectionPoint("source.coffee", { types: ["comment"] });
};
