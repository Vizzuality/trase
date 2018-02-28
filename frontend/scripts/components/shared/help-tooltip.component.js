/* eslint-disable no-new */
import Tooltip from 'tooltip.js';
import 'styles/components/shared/help-tooltip.scss';

export default class {
  onCreated() {
    this.tooltips = [];
    this._loadTooltip();
  }

  onRemoved() {
    this.tooltips.forEach(tooltip => tooltip.dispose());
    this.tooltips = [];
  }

  checkTooltip() {
    this._loadTooltip();
  }

  _loadTooltip() {
    const tooltipElements = Array.prototype.slice.call(
      document.querySelectorAll('.js-tooltip:not([data-tooltip-load])'),
      0
    );

    tooltipElements.forEach(element => {
      const tooltip = new Tooltip(element, {
        title: element.getAttribute('data-tooltip-text'),
        placement: element.getAttribute('data-tooltip-position') || 'bottom left',
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

      this.tooltips.push(tooltip);

      element.classList.add('c-tooltip');
      element.setAttribute('data-tooltip-load', '1');
    });
  }
}
