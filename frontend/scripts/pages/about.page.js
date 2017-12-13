import AboutMarkup from 'html/about.ejs';
import NavMarkup from 'html/includes/_nav.ejs';
import FooterMarkup from 'html/includes/_footer.ejs';
import FeedbackMarkup from 'html/includes/_feedback.ejs';

import 'styles/about.scss';

import Nav from 'components/shared/nav.component.js';
import smoothScroll from 'utils/smoothScroll';
import { calculateOffsets, scrollDocument } from 'utils/fixedScroll';
import _ from 'lodash';

const _toggleAnchors = (e, options) => {
  const target = e && e.target.hash;
  const anchorItems = options.elems.anchorItems;

  anchorItems.forEach((anchorItem) => {
    anchorItem.parentElement.classList.toggle('-selected', anchorItem.hash === target);
  });
};

const _onScrollDocument = (options) => {
  const el = options.elems.anchorNav;
  const cutOffsets = {
    cutTopOffsets: options.cutTopOffsets,
    cutBottomOffsets: options.cutBottomOffsets
  };

  _calculateOffsets(options);
  scrollDocument(el, cutOffsets);
};

const _calculateOffsets = (options) => {
  Object.assign(options, {
    cutTopOffsets: calculateOffsets(options.elems.cutTop),
    cutBottomOffsets: calculateOffsets(options.elems.cutBottom),
  });
};

const _setEventListeners = (options) => {
  const anchorItems = options.elems.anchorItems;
  const _onScrollThrottle = _.throttle(() => _onScrollDocument(options), 50, { leading: true });
  const _calculateOffsetsThrottle = _.throttle(() => _calculateOffsets(options), 50, { leading: true });

  document.addEventListener('scroll', _onScrollThrottle);
  window.onresize = _calculateOffsetsThrottle;

  anchorItems.forEach((anchorItem) => {
    anchorItem.addEventListener('click', (e) => _toggleAnchors(e, options));
  });

  smoothScroll(anchorItems);
};

export const mount = (root) => {
  root.innerHTML = AboutMarkup({
    nav: NavMarkup({ page: 'about' }),
    footer: FooterMarkup(),
    feedback: FeedbackMarkup()
  });

  const options = {
    elems: {
      anchorNav: document.querySelector('.js-anchor-nav'),
      anchorItems: document.querySelectorAll('.anchor-item > a'),
      cutTop: document.querySelector('.cut.-top'),
      cutBottom: document.querySelector('.cut.-bottom')
    }
  };

  _calculateOffsets(options);
  _setEventListeners(options);
  new Nav();
};

