Q             = require "q"
ZombieBrowser = require "zombie"
FormData      = require "./zombie_driver/form_data"
Driver        = require "../driver"

class ZombieDriver extends Driver

  constructor: (options) ->
    @browser = new ZombieBrowser options
    @browser.window.FormData = FormData
    _request = @browser.resources.request
    @browser.resources.request = (method, url, data, headers, callback) =>
      if data instanceof FormData
        headers["content-type"] = "multipart/form-data"
      _request.call @browser.resources, method, url, data, headers, callback

  visitUri: (uri, options, callback) ->
    [options, callback] = [{}, options] unless callback?

    visit = @_browserCall "visit", uri, options
    visit.then ->
      callback null
    , (err) -> callback err

  click: (selector, callback) ->
    @findElementBySelector selector, (err, target) =>
      return callback err if err?

      click = @_browserCall "fire", "click", target
      click.then ->
        callback null
      , (err) -> callback err

  fill: (selector, value, callback) ->
    @_browserCall "fill", selector, value
    callback null

  attach: (selector, filePath, callback) ->
    attach = @_browserCall "attach", selector, filePath
    attach.then ->
      callback null
    , (err) -> callback err

  findElementBySelector: (selector, callback) ->
    try
      target = @browser.link(selector) or @browser.button(selector) or @browser.querySelector(selector)
    catch err
      return callback err
    if target
      callback null, target
    else
      callback new Error "Could not find selector \"#{selector}\" in\n #{@browser.html()}"

  _browserCall: (method, args...) ->
    deferred = Q.defer()
    try
      promise = @browser[method].apply @browser, args
      deferred.resolve promise
    catch err
      deferred.reject err

module.exports = ZombieDriver
