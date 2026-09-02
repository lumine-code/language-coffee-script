(atx_heading) @markup.heading.litcoffee
(setext_heading) @markup.heading.litcoffee
(paragraph) @markup.paragraph.litcoffee
(block_quote) @markup.quote.blockquote.litcoffee
(thematic_break) @markup.horizontal-rule.litcoffee
(list_item) @markup.list.unnumbered.litcoffee
(link_destination) @markup.underline.link.litcoffee
(indented_code_block) @markup.raw.block.coffee

[
  (atx_h1_marker)
  (atx_h2_marker)
  (atx_h3_marker)
  (atx_h4_marker)
  (atx_h5_marker)
  (atx_h6_marker)
] @punctuation.definition.heading.litcoffee

[
  (list_marker_star)
  (list_marker_minus)
  (list_marker_plus)
  (list_marker_dot)
  (list_marker_parenthesis)
] @punctuation.definition.list-item.litcoffee
