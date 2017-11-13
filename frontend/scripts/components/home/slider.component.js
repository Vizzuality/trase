import Siema from 'siema';

export default class {

  constructor(settings) {
    this.options = Object.assign({}, settings);
    this.el = document.querySelector(this.options.selector);
    this.init();
  }

  init() {
    const { selector, perPage, next, prev } = this.options;
    this.slider = new Siema({ selector, perPage, loop: true });
    if (next) document.querySelector(next).addEventListener('click', () => this.slider.next());
    if (prev) document.querySelector(prev).addEventListener('click', () => this.slider.prev());
  }

  destroy() {
    const { next, prev } = this.options;
    if (next) document.querySelector(next).removeEventListener('click', () => this.slider.next());
    if (prev) document.querySelector(prev).removeEventListener('click', () => this.slider.prev());
    this.slider.destroy();
  }
}
