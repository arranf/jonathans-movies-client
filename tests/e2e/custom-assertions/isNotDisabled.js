// A custom Nightwatch assertion.
// the name of the method is the filename.
// can be used in tests like this:
//
//   browser.assert.isDisabled(selector)
//
// for how to write custom assertions see
// http://nightwatchjs.org/guide#writing-custom-assertions
exports.assertion = function (selector) {
  this.message = 'Testing if element <' + selector + '> is not disabled'
  this.expected = false
  this.pass = function (val) {
    return val === this.expected
  }
  this.value = function (res) {
    return res.value
  }
  this.command = function (cb) {
    var self = this
    return this.api.execute(
      function (selector) {
        var element = document.querySelector(selector)
        if (!element.hasAttribute('disabled')) {
          return false
        } else {
          return element.getAttribute('disabled')
        }
      },
      [selector],
      function (res) {
        cb.call(self, res)
      }
    )
  }
}
