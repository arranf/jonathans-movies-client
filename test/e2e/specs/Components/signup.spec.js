// For authoring Nightwatch tests, see
// http://nightwatchjs.org/guide#usage

module.exports = {
  'back': function (browser) {
    const devServer = browser.globals.devServerURL

    browser
      .url(devServer + '/signup')
      .waitForElementVisible('#app', 5000)
      .click('#back')
      .assert.urlEquals(devServer + '/')
      .end()
  },
  'snackbar': function (browser) {
    const devServer = browser.globals.devServerURL

    browser
      .url(devServer + '/signup')
      .waitForElementVisible('#app', 5000)
      .assert.elementNotPresent('.mdl-snackbar--active')
      .setValue('input[type=email]', 'valid@email.com')
      .setValue('input[type=password]', 'password')
      .click('#submit')
      .waitForElementVisible('.mdl-snackbar--active', 5000)
      .end()
  }
}
