var util = require("util");
var Driver = require("../driver");
var fs = require("fs");
var selenium = require("selenium-launcher");
var soda = require("soda");

var withSelenium = function(callback) {
  if (SeleniumDriver._seleniumInstance) {
    callback(null, SeleniumDriver._seleniumInstance);
  } else {
    selenium(function(err, selenium) {
      SeleniumDriver._seleniumInstance = selenium;
      process.on('exit', function() {
        selenium.kill();
      });
      callback(null, selenium);
    });
  }
};

function SeleniumDriver(options, callback) {
  var self = this;
  withSelenium(function(err, selenium) {
    if (err != null) {
      throw err;
    }
    self.browser = soda.createClient({
      host: selenium.host,
      port: selenium.port,
      url: "http://" + selenium.host + ":" + selenium.port + "/",
      browser: 'firefox'
    });
    self.browser.session(function(err) {
      callback(err, self);
    });
  });
}

util.inherits(SeleniumDriver, Driver);

SeleniumDriver.prototype.visitUri = function(uri, options, callback) {
  if (callback == null) {
    callback = options;
    options = {};
  }
  this.browser.open(uri, function(err, body, res) {
    callback(err);
  });
};

SeleniumDriver.prototype.click = function(selector, callback) {
  this._do("clickAndWait", selector, [], function(err) {
    callback(err);
  });
};

SeleniumDriver.prototype.fill = function(selector, value, callback) {
  this._do("type", selector, [value], function(err) {
    callback(err);
  });
};

SeleniumDriver.prototype.attach = function(selector, filePath, callback) {
  throw new Error("NOT IMPLEMENTED");
};

SeleniumDriver.prototype.findElementBySelector = function(selector, callback) {
  throw new Error("NOT IMPLEMENTED");
};

SeleniumDriver.prototype.findElementsBySelector = function(selector, callback) {
  throw new Error("NOT IMPLEMENTED");
};

SeleniumDriver.prototype.getText = function(callback) {
  this._do("getText", "body", [], function(err, text) {
    if (err)
      callback(err);
    else
      callback(null, text);
  });
};

SeleniumDriver.prototype._do = function(method, selector, args, callback) {
  var browser = this.browser;

  function makeCallerWithFallback(query, errorCallback) {
    var _args = [query].concat(args);
    _args.push(function (err, __) {
      var results = Array.prototype.slice.call(arguments);
      if (err)
        errorCallback.apply(null, results);
      else
        callback.apply(null, results);
    });
    return function () {
      browser[method].apply(browser, _args);
    }
  }

  var queryAsCss = makeCallerWithFallback("css=" + selector, callback);
  var queryAsName = makeCallerWithFallback("name=" + selector, queryAsCss);
  var queryAsLink = makeCallerWithFallback("link=" + selector, queryAsName);
  queryAsLink();
};

module.exports = SeleniumDriver;
