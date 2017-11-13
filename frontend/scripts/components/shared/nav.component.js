import 'styles/components/shared/nav.scss';

const defaults = { el: '.c-nav', haveSolidBackground: false, pageOffset: 0 };

export default class {

  constructor(settings ) {
    this.options = Object.assign({}, defaults, settings);
    this.el = document.querySelector(this.options.el);
    this._setEventListeners();
  }

  _setEventListeners() {
    document.addEventListener('scroll', () => this._checkBackground());
  }

  _checkBackground() {
    const { pageOffset } = this.options;
    if (window.pageYOffset > pageOffset && !this.options.haveSolidBackground) {
      this.el.classList.add('-have-background');
      this.options.haveSolidBackground = true;
    } else if(window.pageYOffset <= pageOffset && this.options.haveSolidBackground) {
      this.el.classList.remove('-have-background');
      this.options.haveSolidBackground = false;
    }
  }
}
