# language-coffee-script

CoffeeScript language support.

Fork of [pulsar-edit/pulsar](https://github.com/pulsar-edit/pulsar) (`packages/language-coffee-script`).

## Features

- **Grammars**: provides Tree-sitter grammars built from [tree-sitter-coffeescript](https://github.com/svkozak/tree-sitter-coffeescript) and [tree-sitter-markdown](https://github.com/tree-sitter-grammars/tree-sitter-markdown).
- **Symbols**: classes, named functions, methods and bindings, including literate code blocks.
- **Syntax highlighting**: full grammar coverage for CoffeeScript and Literate CoffeeScript files.
- **Snippets**: shortcuts for common declarations and control structures.
- **Comment toggling**: line and block comment support.

## Installation

To install `language-coffee-script` search for it in the Install pane of the Lumine settings, or run the command `lumine --install lumine-code/language-coffee-script`.

## Injections

- Static Tree-sitter injections highlight URLs with `language-hyperlink`.
- Static Tree-sitter injections highlight comment markers with `language-todo`.

## Contributing

Got ideas to make this package better, found a bug, or want to help add new features? Just drop your thoughts on GitHub. Any feedback is welcome!
