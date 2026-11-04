((indented_code_block) @injection.owner @injection.content
  (#set! injection.language "coffeescript")
  (#set! injection.include-children)
  (#set! injection.content-edit-policy "content-words"))

((html_block) @injection.owner @injection.content
  (#set! injection.language "html")
  (#set! injection.include-children)
  (#set! injection.content-edit-policy "content-words"))

((inline) @injection.owner @injection.content
  (#set! injection.language "hyperlink")
  (#set! injection.language-scope "none"))
