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
      .waitForElementVisible('#app', 5000)
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
      .setValue('input[type=email]', 'aninvalidemail')
      .setValue('input[type=password]', 'password')
      .assert.attributeEquals('#submit', 'disabled', 'true')
      // Test valid input, the submit button should not be disabled
      .setValue('input[type=email]', 'valid@email.com')
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
      .waitForElementVisible('#app', 5000)
      .click('#facebook')
      .pause(1000)
      .assert.urlContains('https://www.facebook.com')
      .end()
  },
  'snackbar': function (browser) {
    const devServer = browser.globals.devServerURL

    browser
      .url(devServer)
      .waitForElementVisible('#app', 5000)
      .assert.elementNotPresent('.mdl-snackbar--active')
      .click('#login')
      .setValue('input[type=email]', 'valid@email.com')
      .setValue('input[type=password]', 'password')
      .click('#submit')
      .waitForElementVisible('.mdl-snackbar--active', 5000)
      .end()
  }
}
