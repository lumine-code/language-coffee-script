(comment) @comment.line.number-sign.coffee

((comment) @punctuation.definition.comment.coffee
  (#set! adjust.startAndEndAroundFirstMatchOf "^#+"))

(number) @constant.numeric.coffee
(string) @string.quoted.double.coffee
(regex) @string.regexp.coffee
(boolean) @constant.language.boolean.coffee
(null_literal) @constant.language.null.coffee
(undefined_literal) @constant.language.undefined.coffee

(instance_variable
  (identifier) @variable.other.member.coffee)

(function_definition
  (identifier) @entity.name.function.coffee)

(method_definition
  (identifier) @entity.name.function.method.coffee)

(class_property_method
  (identifier) @entity.name.function.method.coffee)

(parameters
  (parameter
    (pattern
      (identifier) @variable.parameter.coffee)))

(parameters
  (parameter
    (pattern
      (instance_variable (identifier) @variable.parameter.coffee))))

(function_call
  (expression
    (identifier) @entity.name.function.call.coffee))

(function_call
  (expression
    (member_expression
      (identifier) @entity.name.function.method.call.coffee)))

(class_definition
  (identifier) @entity.name.type.class.coffee)

(class_property_block
  (identifier) @variable.other.property.coffee)

(class_property_assignment
  (identifier) @variable.other.property.coffee)

(pair
  (identifier) @variable.other.key.coffee)

[
  "class"
  "extends"
  "if"
  "else"
  "unless"
  "when"
  "switch"
  "for"
  "while"
  "until"
  "then"
  "do"
  "by"
  "try"
  "catch"
  "finally"
  "loop"
] @keyword.control.coffee

[
  (break_statement)
  (continue_statement)
  (return_statement)
  (throw_statement)
] @keyword.control.coffee

[
  "import"
  "export"
  "from"
  "as"
  "default"
] @keyword.control.import.coffee

[
  "and"
  "or"
  "not"
  "is"
  "isnt"
  "in"
  "of"
  "instanceof"
  "new"
  "typeof"
  "delete"
  "await"
  "async"
  "yield"
] @keyword.operator.coffee

(identifier) @variable.other.coffee
