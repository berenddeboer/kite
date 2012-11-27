function Browser(driver) {
  this.driver = driver;
}

Browser.prototype.visitUri = function(uri, options, callback) {
  if (callback == null) {
    callback = options;
    options = {};
  }
  this.driver.visitUri(uri, options, callback);
};

Browser.prototype.click = function(selector, callback) {
  this.driver.click(selector, callback);
};

Browser.prototype.fill = function(selector, value, callback) {
  this.driver.fill(selector, value, callback);
};

Browser.prototype.attach = function(selector, filePath, callback) {
  this.driver.attach(selector, filePath, callback);
};

Browser.prototype.query = function(selector, callback) {
  this.driver.findElementBySelector(selector, callback);
};

Browser.prototype.queryAll = function(selector, callback) {
  this.driver.findElementsBySelector(selector, callback);
};

Browser.prototype.getText = function(callback) {
  this.driver.getText(callback);
};

module.exports = Browser;