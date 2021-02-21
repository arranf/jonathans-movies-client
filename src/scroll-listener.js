const MARGIN = 20;

function listenerSetup(callback) {
  // event is the scroll listener event
  return (_event) => {
    // >= prevents iOS overscroll bugs: https://stackoverflow.com/questions/11172917/jquery-detect-bottom-of-page-on-mobile-safari-ios
    if (getScrollXY()[1] + window.innerHeight + MARGIN >= getDocHeight()) {
      callback();
    }
  };
}

// http://james.padolsey.com/javascript/get-document-height-cross-browser/
// https://jsfiddle.net/W75mP/
// https://github.com/nuxt/nuxt.js/issues/2512
function getScrollXY() {
  const scrollTop = Math.max(
    window.pageYOffset,
    document.documentElement.scrollTop,
    document.body.scrollTop
  );
  const scrollLeft = Math.max(
    window.pageXOffset,
    document.body.scrollLeft,
    document.documentElement.scrollLeft
  );
  return [scrollLeft, scrollTop];
}

function getDocHeight() {
  return Math.max(
    document.body.scrollHeight,
    document.documentElement.scrollHeight,
    document.body.offsetHeight,
    document.documentElement.offsetHeight,
    document.body.clientHeight,
    document.documentElement.clientHeight
  );
}

export default listenerSetup;
