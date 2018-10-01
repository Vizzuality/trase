import debounce from 'lodash/debounce';
import TooltipTemplate from 'templates/shared/info-tooltip.ejs';
import 'styles/components/shared/info-tooltip.scss';

export default class {
  constructor(selector) {
    this.el = typeof selector === 'string' ? document.querySelector(selector) : selector;
    this.hide = debounce(this._hide.bind(this), 100);
  }

  show = (x, y, title, values) => {
    this.hide.cancel();

    this.el.innerHTML = TooltipTemplate({ title, values });
    this.el.classList.remove('is-hidden');

    const fx =
      x < window.innerWidth - this.el.clientWidth - 10 ? x + 10 : x - this.el.clientWidth - 10;
    const fy =
      y < window.innerHeight - this.el.clientHeight - 10 ? y + 10 : y - this.el.clientHeight - 10;

    this.el.style.left = `${fx}px`;
    this.el.style.top = `${fy}px`;
  };

  _hide = () => {
    this.el.classList.add('is-hidden');
  };
}
