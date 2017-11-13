
export default (elems) => {

  // We do not want this script to be applied in browsers that do not support those
  // That means no smoothscroll on IE9 and below.
  if (document.querySelectorAll === void 0 || window.pageYOffset === void 0 || history.pushState === void 0) {
    return;
  }

    // Get the top position of an element in the document
  const getTop = function(element) {
    // return value of html.getBoundingClientRect().top ... IE : 0, other browsers : -pageYOffset
    if (element.nodeName === 'HTML') {
      return -window.pageYOffset;
    }
    return element.getBoundingClientRect().top + window.pageYOffset;
  };

  // ease functions thanks to:
  // http://blog.greweb.fr/2012/02/bezier-curve-based-easing-functions-from-concept-to-implementation/
  const easings = {
    linear: function(t) {
      return t;
    },
    easeInQuad: function(t) {
      return t * t;
    },
    easeOutQuad: function(t) {
      return t * (2 - t);
    },
    easeInOutQuad: function(t) {
      return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    },
    easeInCubic: function(t) {
      return t * t * t;
    },
    easeOutCubic: function(t) {
      return (--t) * t * t + 1;
    },
    easeInOutCubic: function(t) {
      return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    },
    easeInQuart: function(t) {
      return t * t * t * t;
    },
    easeOutQuart: function(t) {
      return 1 - (--t) * t * t * t;
    },
    easeInOutQuart: function(t) {
      return t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t;
    },
    easeInQuint: function(t) {
      return t * t * t * t * t;
    },
    easeOutQuint: function(t) {
      return 1 + (--t) * t * t * t * t;
    },
    easeInOutQuint: function(t) {
      return t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t;
    }
  };

  // calculate the scroll position we should be in
  // given the start and end point of the scroll
  // the time elapsed from the beginning of the scroll
  // and the total duration of the scroll (default 500ms)
  const position = function(start, end, elapsed, duration) {
    if (elapsed > duration) { return end; }
    return start + (end - start) * easings.easeInOutQuint(elapsed / duration);
  };

  // we use requestAnimationFrame to be called by the browser before every repaint
  // if the first argument is an element then scroll to the top of this element
  // if the first argument is numeric then scroll to this location
  // if the callback exist, it is called when the scrolling is finished
  const smoothScroll = function(el, duration, callback) {
    duration = duration || 500;
    var start = window.pageYOffset, end;

    if (typeof el === 'number') {
      end = parseInt(el);
    } else {
      end = getTop(el);
    }

    var clock = Date.now();
    var requestAnimationFrame = window.requestAnimationFrame ||
      window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame ||
      function(fn) { window.setTimeout(fn, 15); };

    var step = function() {
      var elapsed = Date.now() - clock;
      window.scroll(0, position(start, end, elapsed, duration));
      if (elapsed > duration) {
        if (typeof callback === 'function') {
          callback(el);
        }
      } else {
        requestAnimationFrame(step);
      }
    };

    step();
  };

  const linkHandler = function(ev) {
    ev.preventDefault();

    if (!this.hash) { return false; }

    var target = document.getElementById(this.hash.substring(1));

    if (target) {
      if (location.hash !== this.hash) {
        window.history.pushState(null, null, this.hash);
      }

      // using the history api to solve issue #1 - back doesn't work
      // most browser don't update :target when the history api is used:
      // THIS IS A BUG FROM THE BROWSERS.
      // change the scrolling duration in this call
      smoothScroll(target, 500, function(el) {
        location.replace('#' + el.id); // this will cause the :target to be activated.
      });
    }
  };

  if (!elems.length) return;

  elems.forEach((el) => {
    el.addEventListener('click', linkHandler, false);
  });


  // We look for all the internal links in the documents and attach the smoothscroll function
  // document.addEventListener('DOMContentLoaded', function() {
  //   const internal = document.querySelectorAll('.anchor-item > a');
  //
  //   for (let i = internal.length; i--;) {
  //     internal[i].addEventListener('click', linkHandler, false);
  //   }
  // });

  // return smoothscroll API
  return smoothScroll;
};
