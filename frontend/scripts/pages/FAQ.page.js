import FAQMarkup from 'html/FAQ.ejs';
import NavMarkup from 'html/includes/_nav.ejs';
import FooterMarkup from 'html/includes/_footer.ejs';

import Nav from 'components/shared/nav.component.js';
import 'styles/FAQ.scss';

import smoothScroll from 'utils/smoothScroll';
import { calculateOffsets, scrollDocument } from 'utils/fixedScroll';
import _ from 'lodash';

const options = {
  elems: {
    anchorNav: document.querySelector('.js-anchor-nav'),
    anchorItems: document.querySelectorAll('.anchor-item > a'),
    cutTop: document.querySelector('.cut.-top'),
    cutBottom: document.querySelector('.cut.-bottom')
  }
};

const _toggleAnchors = (e) => {
  const target = e && e.target.hash;
  const anchorItems = options.elems.anchorItems;

  anchorItems.forEach((anchorItem) => {
    anchorItem.parentElement.classList.toggle('-selected', anchorItem.hash === target);
  });
};

const _onScrollDocument = () => {
  const el = options.elems.anchorNav;
  const elemOffsets = options.elemOffsets;
  const cutOffsets = {
    cutTopOffsets: options.cutTopOffsets,
    cutBottomOffsets: options.cutBottomOffsets
  };

  _calculateOffsets();
  scrollDocument(el, elemOffsets, cutOffsets);
};

const _calculateOffsets = () => {
  Object.assign(options, {
    cutTopOffsets: calculateOffsets(options.elems.cutTop),
    cutBottomOffsets: calculateOffsets(options.elems.cutBottom),
  });
};

const _setEventListeners = () => {
  const anchorItems = options.elems.anchorItems;
  const _onScrollThrottle = _.throttle(_onScrollDocument, 50, { leading: true });
  const _calculateOffsetsThrottle = _.throttle(_calculateOffsets, 50, { leading: true });

  document.addEventListener('scroll', _onScrollThrottle);
  window.onresize = _calculateOffsetsThrottle;

  anchorItems.forEach((anchorItem) => {
    anchorItem.addEventListener('click', (e) => _toggleAnchors(e));
  });

  smoothScroll(anchorItems);
};

export const render = (root) => {
  root.innerHTML = FAQMarkup({ nav: NavMarkup({ page: 'FAQ' }), footer: FooterMarkup() });
  _calculateOffsets();
  _setEventListeners();

  new Nav();
};

