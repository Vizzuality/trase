import debounce from 'lodash/debounce';
import TooltipTemplate from 'legacy/info-tooltip.ejs';
import 'styles/components/shared/info-tooltip.scss';

export default class {
  constructor(selector) {
    this.el = typeof selector === 'string' ? document.querySelector(selector) : selector;
    this.hide = debounce(this._hide.bind(this), 100);
  }

  show = (x, y, title, values, height, width) => {
    this.hide.cancel();

    this.el.innerHTML = TooltipTemplate({ title, values });
    this.el.classList.remove('is-hidden');

    const w = width || document.documentElement.clientHeight;
    const h = height || document.documentElement.clientWidth;

    const canDisplayOnRight = x < w - this.el.clientWidth - 10;
    const canDisplayOnBottom = y < h - this.el.clientHeight - 10;

    const fx = canDisplayOnRight ? x + 10 : x - this.el.clientWidth - 10;
    const fy = canDisplayOnBottom ? y + 10 : y - this.el.clientHeight - 10;

    this.el.style.left = `${fx}px`;
    this.el.style.top = `${fy}px`;
  };

  _hide = () => {
    this.el.classList.add('is-hidden');
  };
}
