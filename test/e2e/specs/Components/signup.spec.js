// For authoring Nightwatch tests, see
// http://nightwatchjs.org/guide#usage

module.exports = {
  'back': function (browser) {
    const devServer = browser.globals.devServerURL

    browser
      .url(devServer + '/signup')
      .waitForElementVisible('#app-container', 5000)
      .click('#back')
      .assert.urlEquals(devServer + '/')
      .end()
  },
  // TODO Find a way to make this work with the server running
  // 'snackbar': function (browser) {
  //   const devServer = browser.globals.devServerURL

  //   browser
  //     .url(devServer + '/signup')
  //     .waitForElementVisible('#app-container', 5000)
  //     .assert.elementNotPresent('#snackbar')
  //     .setValue('#email', 'valid@email.com')
  //     .setValue('#password', 'password')
  //     .click('#submit')
  //     .waitForElementVisible('#snackbar', 5000)
  //     .end()
  // }
}
