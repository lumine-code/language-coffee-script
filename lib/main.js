let injectionRegistrations = [];

exports.activate = function () {
  injectionRegistrations.push(
    lumine.grammars.addInjectionPoint("source.coffee", {
      type: "embedded_html",
      language: () => "html",
      content: (node) => node,
    }),
  );

  injectionRegistrations.push(
    lumine.grammars.addInjectionPoint("source.coffee", {
      type: "embedded_js",
      language: () => "javascript",
      content: (node) => node,
    }),
  );

  injectionRegistrations.push(
    lumine.grammars.addInjectionPoint("source.coffee", {
      type: "regex",
      language: () => "regex",
      content(node) {
        return node.descendantsOfType(["single_line_regex", "multi_line_regex"]);
      },
    }),
  );

  injectionRegistrations.push(
    lumine.grammars.addInjectionPoint("source.litcoffee", {
      type: "indented_code_block",
      language: () => "coffeescript",
      content: (node) => node,
      includeChildren: true,
    }),
  );

  injectionRegistrations.push(
    lumine.grammars.addInjectionPoint("source.litcoffee", {
      type: "html_block",
      language: () => "html",
      content: (node) => node,
      includeChildren: true,
    }),
  );
};

exports.consumeHyperlinkInjection = (hyperlink) => {
  const registrations = [];
  registrations.push(hyperlink.addInjectionPoint("source.coffee", { types: ["comment"] }));
  registrations.push(hyperlink.addInjectionPoint("source.litcoffee", { types: ["inline"] }));
  return {
    dispose() {
      for (const registration of registrations.splice(0)) registration.dispose();
    },
  };
};

exports.consumeTodoInjection = (todo) => {
  return todo.addInjectionPoint("source.coffee", { types: ["comment"] });
};

exports.deactivate = function () {
  for (const registration of injectionRegistrations.splice(0)) registration.dispose();
};
