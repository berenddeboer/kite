var util          = require("util");
var Q             = require("q");
var ZombieBrowser = require("zombie");
var FormData      = require("./zombie_driver/form_data");
var Driver        = require("../driver");

function ZombieDriver(options) {
  var _request,
  _this = this;
  this.browser = new ZombieBrowser(options);
  this.browser.window.FormData = FormData;
  _request = this.browser.resources.request;
  this.browser.resources.request = function(method, url, data, headers, callback) {
    delete _this.browser.headers.accept;
    if (data instanceof FormData) {
      headers["content-type"] = "multipart/form-data";
    }
    return _request.call(_this.browser.resources, method, url, data, headers, callback);
  };
}

util.inherits(ZombieDriver, Driver);

ZombieDriver.prototype.visitUri = function(uri, options, callback) {
  if (callback == null) {
    callback = options;
    options = {};
  }
  this
    ._do("visit", [uri, options])
    .then(function() {
      callback(null);
    }, function(err) {
      callback(err);
    });
};

ZombieDriver.prototype.click = function(selector, callback) {
  var self = this;
  this.findElementBySelector(selector, function(err, target) {
    if (err)
      return callback(err);

    self
      ._do("fire", ["click", target])
      .then(function() {
        callback(null);
      }, function(err) {
        callback(err);
      });
  });
};

ZombieDriver.prototype.fill = function(selector, value, callback) {
  this._do("fill", [selector, value]);
  callback(null);
};

ZombieDriver.prototype.attach = function(selector, filePath, callback) {
  this.
    _do("attach", [selector, filePath])
    .then(function() {
      callback(null);
    }, function(err) {
      callback(err);
    });
};

ZombieDriver.prototype.findElementBySelector = function(selector, callback) {
  var target;
  try {
    target = this.browser.link(selector) || this.browser.button(selector) || this.browser.querySelector(selector);
  } catch (err) {
    return callback(err);
  }
  if (target != null) {
    callback(null, target);
  } else {
    callback(new Error("Could not find selector \"" + selector + "\" in\n " + (this.browser.html())));
  }
};

ZombieDriver.prototype.findElementsBySelector = function(selector, callback) {
  var target;
  try {
    target = this.browser.queryAll(selector);
  } catch (err) {
    return callback(err);
  }
  callback(null, target);
};

ZombieDriver.prototype.getText = function(callback) {
  var text;
  text = this.browser.text("body");
  callback(null, text);
};

ZombieDriver.prototype._do = function(method, args) {
  var deferred = Q.defer();
  try {
    promise = this.browser[method].apply(this.browser, args);
    deferred.resolve(promise);
  } catch (err) {
    deferred.reject(err);
  }
  return deferred.promise;
};

module.exports = ZombieDriver;
