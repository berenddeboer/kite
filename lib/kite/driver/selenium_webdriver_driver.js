/**
 * Driver based on WebDriverJS for Node
 */

var util = require("util");
var Driver = require("../driver");
var selenium = require("selenium-webdriver");

util.inherits(SeleniumDriver, Driver);

function SeleniumDriver(options, callback) {
  var self = this;
  self.browser =  new selenium.Builder().
    withCapabilities({'browserName': 'firefox'}).
    build();
}

SeleniumDriver.prototype.visitUri = function(uri, options, callback) {
  if (callback == null) {
    callback = options;
    options = {};
  }
  this.browser.get(uri, options).then (callback);
};

module.exports = SeleniumDriver;
