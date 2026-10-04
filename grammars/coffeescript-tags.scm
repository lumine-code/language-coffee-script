; Named declarations and assignments; calls and anonymous arrows are omitted.
(class_definition . (identifier) @name) @definition.class
[(method_definition . (identifier) @name)
 (class_property_method . (identifier) @name)] @definition.method
(function_definition . (identifier) @name) @definition.function
(assignment_statement
  (pattern (identifier) @name)
  (expression (function_expression))) @definition.function
(assignment_statement
  (pattern (identifier) @name
    (#is-not? test.typeAt "parent.nextNamedSibling.firstNamedChild function_expression"))
  (expression)) @definition.variable
(class_property_assignment . (identifier) @name) @definition.property
