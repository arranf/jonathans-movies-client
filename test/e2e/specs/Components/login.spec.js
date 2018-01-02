// For authoring Nightwatch tests, see
// http://nightwatchjs.org/guide#usage

module.exports = {
  'login': function (browser) {
    // automatically uses dev Server port from /config.index.js
    // default: http://localhost:8080
    // see nightwatch.conf.js
    const devServer = browser.globals.devServerURL

    browser
      .url(devServer)
      .waitForElementVisible('#app-container', 5000)
      // Inital page
      .assert.elementPresent('#login')
      .assert.elementPresent('#facebook')
      // Should be taken to login form
      .click('#login')
      .assert.elementCount('input', 2) // Email and password
      .assert.elementNotPresent('#facebook')
      .assert.elementNotPresent('#login')
      .assert.attributeEquals('#submit', 'disabled', 'true')
      // Test invalid form input, the submit button should still be disabled
      .setValue('#email', 'aninvalidemail')
      .setValue('#password', 'password')
      .assert.attributeEquals('#submit', 'disabled', 'true')
      // Test valid input, the submit button should not be disabled
      .setValue('#email', 'valid@email.com')
      // .assert.attributeEquals('#submit', 'disabled', null)
      .assert.isNotDisabled('#submit')
      .click('#back')
      // We should be on the same page
      .assert.elementPresent('#facebook')
      .assert.elementPresent('#login')
      // Should be taken to signup route
      .click('#signup')
      .assert.urlEquals(devServer + '/signup')
      .end()
  },
  'facebookLogin': function (browser) {
    const devServer = browser.globals.devServerURL

    browser
      .url(devServer)
      .waitForElementVisible('#app-container', 5000)
      .click('#facebook')
      .pause(1000)
      .assert.urlContains('facebook')
      .end()
  },
  'snackbar': function (browser) {
    const devServer = browser.globals.devServerURL
    // This will fail with a test server running
    browser
      .url(devServer)
      .waitForElementVisible('#app-container', 5000)
      .assert.elementNotPresent('.md-snackbar')
      .click('#login')
      .setValue('#email', 'valid@email.com')
      .setValue('#password', 'password')
      .click('#submit')
      .waitForElementVisible('.md-snackbar', 5000)
      .end()
  }
}
