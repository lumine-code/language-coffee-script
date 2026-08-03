# A CoffeeScript sample, kept idiomatic so it is worth opening in the editor.

###
A block comment.
###

fs = require 'fs'
{join, resolve} = require 'path'

MAX_RETRIES = 3
names = ['ada', 'grace', 'alan']
config =
  host: 'localhost'
  port: 8080
  tls:
    enabled: no

greet = (name, greeting = 'Hello') ->
  "#{greeting}, #{name}!"

class Shape
  constructor: (@name, @sides = 0) ->

  area: -> throw new Error 'not implemented'

  toString: -> "#{@name} (#{@sides} sides)"

class Rectangle extends Shape
  constructor: (@width, @height) ->
    super 'rectangle', 4

  area: => @width * @height

square = new Rectangle 3, 3

for name in names when name isnt 'alan'
  console.log greet name

for own key, value of config
  console.log "#{key} = #{value}"

result = if square.area() > 10 then 'large' else 'small'

numbers = (n * n for n in [1..5])

total = numbers.reduce (sum, n) -> sum + n
, 0

unless config.tls.enabled
  console.log 'plaintext'

try
  fs.readFileSync join __dirname, 'missing'
catch error
  console.error error.message
finally
  console.log 'done'

heredoc = """
  Interpolated: #{square}
  """

literal = '''
  Not interpolated: #{square}
  '''

module.exports = {Shape, Rectangle, greet}
