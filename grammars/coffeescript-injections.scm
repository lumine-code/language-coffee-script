((embedded_html) @injection.owner @injection.content
  (#set! injection.language "html")
  (#set! injection.content-edit-policy "content-words"))

((embedded_js) @injection.owner @injection.content
  (#set! injection.language "javascript")
  (#set! injection.content-edit-policy "content-words"))

((regex [(single_line_regex) (multi_line_regex)] @injection.content) @injection.owner
  (#set! injection.language "regex"))

((comment) @injection.owner @injection.content
  (#set! injection.language "hyperlink")
  (#set! injection.language-scope "none")
  (#set! injection.include-children))
((comment) @injection.owner @injection.content
  (#set! injection.language "todo")
  (#set! injection.language-scope "none")
  (#set! injection.include-children))
