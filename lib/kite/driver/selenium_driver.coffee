Driver   = require "../driver"
fs       = require "fs"
selenium = require "selenium-launcher"
soda     = require "soda"

withSelenium = (callback) ->
  if SeleniumDriver._seleniumInstance
    callback null, SeleniumDriver._seleniumInstance
  else
    selenium (err, selenium) ->
      SeleniumDriver._seleniumInstance = selenium
      process.on 'exit', () ->
        selenium.kill()
      callback null, selenium

class SeleniumDriver extends Driver

  constructor: (options, callback) ->
    withSelenium (err, selenium) =>
      throw err if err?
      @browser = soda.createClient
        host: selenium.host
        port: selenium.port
        url:  "http://#{selenium.host}:#{selenium.port}/" # todo: use baseUri?
        browser: 'firefox'
      @browser.session (err) =>
        callback err, @

  visitUri: (uri, options, callback) ->
    [options, callback] = [{}, options] unless callback?

    @browser.open uri, (err, body, res) ->
      callback err

  click: (selector, callback) ->
    @_do "clickAndWait", selector, (err) ->
      callback err

  fill: (selector, value, callback) ->
    @_do "type", selector, value, (err) ->
      callback err

  attach: (selector, filePath, callback) ->
    # TODO
    throw new Error "NOT IMPLEMENTED"

  getText: (callback) ->
    @_do "getText", "body", (err, text) =>
      callback text

  _do: (method, selector, args..., callback) ->
    @browser[method] "link=#{selector}", args..., (err, results...) =>
      if err?
        @browser[method] "name=#{selector}", args..., (err, results...) =>
          if err?
            @browser[method] "css=#{selector}", args..., (err, results...) =>
              callback err, results...
          else
            callback null, results...
      else
        callback null, results...

module.exports = SeleniumDriver
