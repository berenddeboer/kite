var WebPage = function WebPage(uri, callback) {
  var self = this;
  self.uri = uri;

  process.nextTick(function () {
    callback(null, self);
  });
};

WebPage.prototype.getUri = function () {
  return this.uri;
};

module.exports = { WebPage: WebPage };
