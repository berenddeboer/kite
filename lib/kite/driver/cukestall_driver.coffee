Driver = require "../driver"

class CukestallDriver extends Driver

  constructor: (options) ->
    @browser = new window.CukeStall.FrameBrowser "#cucumber-browser"

  visitUri: (uri, options, callback) ->
    [options, callback] = [{}, options] unless callback?
    # todo: options?
    @browser.visitUri uri, callback

  click: (selector, callback) ->
    @browser.click selector, callback

  fill: (selector, value, callback) ->
    @browser.fill selector, value, callback

  attach: (selector, filePath, callback) ->
    # TODO
    throw new Error "NOT IMPLEMENTED"

  getText: (callback) ->
    @browser.getText callback

module.exports = CukestallDriver
