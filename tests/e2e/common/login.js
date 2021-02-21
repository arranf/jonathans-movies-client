function login(browser) {
  const devServer = browser.globals.devServerURL;
  return browser
    .url(devServer)
    .waitForElementVisible("#app-container", 5000)
    .waitForElementVisible("#login", 3000)
    .click("#login")
    .waitForElementVisible("#email", 3000)
    .setValue("#email", "test@example.com")
    .setValue("#password", "test")
    .click("#submit")
    .waitForElementVisible("#home-container", 5000);
}

module.exports = login;
