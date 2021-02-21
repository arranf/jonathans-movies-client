// For authoring Nightwatch tests, see
// http://nightwatchjs.org/guide#usage

let login = require("../../common/login");

module.exports = {
  normalFlow: function (browser) {
    // automatically uses dev Server port from /config.index.js
    // default: http://localhost:8080
    // see nightwatch.conf.js
    const devServer = browser.globals.devServerURL;

    login(browser);

    browser
      .url(devServer + "/create")
      .waitForElementVisible("#app-container", 5000)
      .assert.urlEquals(devServer + "/create")
      // Check no options are displayed on start
      .assert.elementNotPresent("#options-container")
      .assert.elementPresent("#start-poll")
      // Check disabled
      .assert.attributeEquals("#start-poll", "disabled", "true")
      // Add movie from DB
      .setValue("#suggest-input", "Die Hard")
      .waitForElementVisible(".md-list-item:first-child > button", 1000)
      .click(".md-list-item:first-child > button")
      // Check movie added
      .waitForElementVisible("#options-container", 3000)
      .assert.elementCount(".md-chip", 1)
      // Try and add the same movie
      .setValue("#suggest-input", "Die Hard")
      .waitForElementVisible(".md-list-item:first-child > button", 1000)
      .click(".md-list-item:first-child > button")
      // Check it isn't added
      .assert.elementCount(".md-chip", 1)
      // Check for error message
      .assert.elementPresent("#snackbar")
      .setValue("#suggest-input", "Casino Royale")
      .waitForElementVisible(".md-list-item:first-child > button", 1000)
      .click(".md-list-item:first-child > button")
      .waitForElementVisible(".md-chip:nth-child(2)", 3000)
      .assert.elementCount("#options > .md-chip", 2)
      .assert.isNotDisabled("#start-poll")
      .end();
  },
  back: function (browser) {
    const devServer = browser.globals.devServerURL;
    login(browser);
    browser
      .url(devServer + "/create")
      .waitForElementVisible("#app-container", 5000)
      .click("#back")
      .assert.urlEquals(devServer + "/home")
      .end();
  },
};
