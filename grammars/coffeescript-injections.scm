((embedded_html) @injection.owner @injection.content
  (#set! injection.language "html"))

((embedded_js) @injection.owner @injection.content
  (#set! injection.language "javascript"))

((regex [(single_line_regex) (multi_line_regex)] @injection.content) @injection.owner
  (#set! injection.language "regex"))
