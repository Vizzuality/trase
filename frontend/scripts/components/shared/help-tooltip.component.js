/* eslint-disable no-new */
import Tooltip from 'tooltip.js';
import 'styles/components/shared/help-tooltip.scss';

export default class {
  onCreated() {
    this._loadTooltip();
  }

  checkTooltip() {
    this._loadTooltip();
  }

  _loadTooltip() {
    this.tooltips = Array.prototype.slice.call(
      document.querySelectorAll('.js-tooltip:not([data-tooltip-load])'),
      0
    );

    this.tooltips.forEach(tooltip => {
      new Tooltip(tooltip, {
        title: tooltip.getAttribute('data-tooltip-text'),
        placement: tooltip.getAttribute('data-tooltip-position') || 'bottom left',
        container: 'body',
        offset: '1, 1',
        popperOptions: {
          modifiers: {
            preventOverflow: {
              boundariesElement: 'window',
              enabled: true
            }
          }
        }
      });

      tooltip.classList.add('c-tooltip');
      tooltip.setAttribute('data-tooltip-load', '1');
    });
  }
}
