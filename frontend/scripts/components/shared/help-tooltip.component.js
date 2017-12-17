/* eslint-disable no-new */
import Tooltip from 'tether-tooltip';
import 'styles/components/shared/help-tooltip.scss';

export default class {
  onCreated() {
    this._loadTooltip();
  }

  checkTooltip() {
    this._loadTooltip();
  }

  _loadTooltip() {
    this.tooltips = Array.prototype.slice.call(document.querySelectorAll('.js-tooltip:not([data-tooltip-load])'), 0);

    this.tooltips.forEach((tooltip) => {
      new Tooltip({
        target: tooltip,
        content: tooltip.getAttribute('data-tooltip-text'),
        classes: 'c-tooltip',
        position: tooltip.getAttribute('data-tooltip-position') || 'bottom left'
      });

      tooltip.setAttribute('data-tooltip-load', '1');
    });
  }
}
