class Browser

  constructor: (@driver) ->

  visitUri: (uri, options, callback) ->
    [options, callback] = [{}, options] unless callback?
    @driver.visitUri uri, options, callback

  click: (selector, callback) ->
    @driver.click selector, callback

  fill: (selector, value, callback) ->
    @driver.fill selector, value, callback

  attach: (selector, filePath, callback) ->
    @driver.attach selector, filePath, callback

  query: (selector, callback) ->
    @driver.findElementBySelector selector, callback

  getText: (callback) ->
    @driver.getText callback

module.exports = Browser
