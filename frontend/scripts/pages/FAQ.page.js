/* eslint-disable no-new */
import FAQMarkup from 'html/FAQ.ejs';
import NavMarkup from 'html/includes/_nav.ejs';
import FooterMarkup from 'html/includes/_footer.ejs';
import FeedbackMarkup from 'html/includes/_feedback.ejs';


import NavContainer from 'containers/shared/nav.container';
import 'styles/FAQ.scss';

import smoothScroll from 'utils/smoothScroll';
import { calculateOffsets, scrollDocument } from 'utils/fixedScroll';
import _ from 'lodash';
import EventManager from 'utils/eventManager';

const evManager = new EventManager();

const _toggleAnchors = (e, options) => {
  const target = e && e.target.hash;
  const anchorItems = options.elems.anchorItems;

  anchorItems.forEach((anchorItem) => {
    anchorItem.parentElement.classList.toggle('-selected', anchorItem.hash === target);
  });
};

const _calculateOffsets = (options) => {
  Object.assign(options, {
    cutTopOffsets: calculateOffsets(options.elems.cutTop),
    cutBottomOffsets: calculateOffsets(options.elems.cutBottom)
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

const _setEventListeners = (options) => {
  const anchorItems = options.elems.anchorItems;
  const _onScrollThrottle = _.throttle(() => _onScrollDocument(options), 50, { leading: true });
  const _calculateOffsetsThrottle = _.throttle(() => _calculateOffsets(options), 50, { leading: true });
  const _toggleAnchorHandler = e => _toggleAnchors(e, options);

  evManager.addEventListener(document, 'scroll', _onScrollThrottle);
  evManager.addEventListener(window, 'resize', _calculateOffsetsThrottle);

  anchorItems.forEach((anchorItem) => {
    evManager.addEventListener(anchorItem, 'click', _toggleAnchorHandler);
  });

  smoothScroll(anchorItems);
};

const mount = (root, store) => {
  root.innerHTML = FAQMarkup({
    nav: NavMarkup({ page: 'FAQ' }),
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

  new NavContainer(store);
};

const unmount = () => {
  evManager.clearEventListeners();
};

export default { mount, unmount };
