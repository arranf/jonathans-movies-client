function listenerSetup (callback) {
  // event is the scroll listener event
  return (event) => {
    // >= prevents iOS overscroll bugs: https://stackoverflow.com/questions/11172917/jquery-detect-bottom-of-page-on-mobile-safari-ios
    if ((getScrollXY()[1] + window.innerHeight) >= getDocHeight()) {
      callback()
    }
  }
}

// http://james.padolsey.com/javascript/get-document-height-cross-browser/
// https://jsfiddle.net/W75mP/
// https://github.com/nuxt/nuxt.js/issues/2512
function getScrollXY () {
  const scrollTop = Math.max(window.pageYOffset, document.documentElement.scrollTop, document.body.scrollTop)
  const scrollLeft = Math.max(window.pageXOffset, document.body.scrollLeft, document.documentElement.scrollLeft)
  return [ scrollLeft, scrollTop ]
}

function getDocHeight () {
  var D = document
  return Math.max(
    D.body.scrollHeight, D.documentElement.scrollHeight,
    D.body.offsetHeight, D.documentElement.offsetHeight,
    D.body.clientHeight, D.documentElement.clientHeight
  )
}

export default listenerSetup;