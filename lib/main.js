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
