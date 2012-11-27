var util = require("util");
var Driver = require("../driver");

function CukestallDriver(options) {
  this.constructor.super_(options);
  this.browser = new window.CukeStall.FrameBrowser("#cucumber-browser");
}

util.inherits(CukestallDriver, Driver);

CukestallDriver.prototype.visitUri = function(uri, options, callback) {
  if (callback == null) {
    callback = options;
    options = {};
  }
  this.browser.visitUri(uri, callback);
};

CukestallDriver.prototype.click = function(selector, callback) {
  this.browser.click(selector, callback);
};

CukestallDriver.prototype.fill = function(selector, value, callback) {
  this.browser.fill(selector, value, callback);
};

CukestallDriver.prototype.attach = function(selector, filePath, callback) {
  throw new Error("NOT IMPLEMENTED");
};

CukestallDriver.prototype.findElementBySelector = function(selector, callback) {
  throw new Error("NOT IMPLEMENTED");
};

CukestallDriver.prototype.findElementsBySelector = function(selector, callback) {
  throw new Error("NOT IMPLEMENTED");
};

CukestallDriver.prototype.getText = function(callback) {
  this.browser.getText(callback);
};

module.exports = CukestallDriver;