var World = require("../support/world").World;


module.exports = function () {
  var Given = When = Then = this.defineStep;

  this.World = World;

  Given("a web page", function (callback) {
    this.prepareAWebPage(callback);
  });

  When("I visit the page", function (callback) {
    this.browser.visitUri(this.webPage.getUri(), {}, callback);
  });

  Then("I see the page contents", function (callback) {
    callback.pending();
  });
};
