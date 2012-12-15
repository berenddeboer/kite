var express = require('express');
var WebPage = require("./web_page").WebPage;

var WebApp = function WebApp(callback) {
  var self = this;

  self.server = express();

  self.server.get('/', function(req, res){
    res.send('hello world');
  });

  self.server.listen(3000);

  process.nextTick(function () {
    callback(null, self);
  });
};

WebApp.prototype.getRootPage = function getRootPage(callback) {
  var self = this;

  if (self.rootPage)
    callback(null, self.rootPage);
  else {
    var pageUri = self.getUriToPath('/');
    new WebPage(pageUri, function (err, page) {
      self.rootPage = page;
      callback(null, page);
    });
  }
};

WebApp.prototype.getUriToPath = function getUriToPath(path) {
  throw new Error("todo");
};

module.exports = { WebApp: WebApp };
