var WebApp       = require("./web_app").WebApp;
var Kite         = require("../../lib/kite");
var ZombieDriver = require("../../lib/kite/driver/zombie_driver");

var World = function World(callback) {
  var driver   = new ZombieDriver();
  this.browser = new Kite.Browser(driver);
  callback();
};

World.prototype.prepareAWebPage = function (callback) {
  var self = this;

  self.webApp  = new WebApp(function (err, app) {
    app.getRootPage(function (err, page) {
      self.webPage = page;
      callback();
    });
  });
};

module.exports = { World: World };
