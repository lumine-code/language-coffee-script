((indented_code_block) @injection.owner @injection.content
  (#set! injection.language "coffeescript")
  (#set! injection.include-children))

((html_block) @injection.owner @injection.content
  (#set! injection.language "html")
  (#set! injection.include-children))
