import _ from 'lodash';
import TooltipTemplate from 'templates/shared/info-tooltip.ejs';
import 'styles/components/shared/info-tooltip.scss';

export default class {
  constructor(className) {
    this.className = className;
    this.hide = _.debounce(this._hide, 100);
  }

  show(x, y, title, values) {
    this.hide.cancel();
    if (this.el === undefined) {
      this.el = document.querySelector(this.className);
    }

    this.el.innerHTML = TooltipTemplate({ title, values });
    this.el.classList.remove('is-hidden');

    const fx = (x < window.innerWidth - this.el.clientWidth - 10) ? x + 10 : x - this.el.clientWidth - 10;
    const fy = (y < window.innerHeight - this.el.clientHeight - 10) ? y + 10 : y - this.el.clientHeight - 10;

    this.el.style.left = `${fx}px`;
    this.el.style.top = `${fy}px`;
  }

  _hide() {
    if (this.el === undefined) {
      this.el = document.querySelector(this.className);
    }
    this.el.classList.add('is-hidden');
  }
}
