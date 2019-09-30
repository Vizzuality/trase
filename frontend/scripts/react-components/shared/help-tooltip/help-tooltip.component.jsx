/* eslint-disable jsx-a11y/mouse-events-have-key-events */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Tooltip from 'tooltip.js';

import './help-tooltip.scss';

export default class TooltipComponent extends Component {
  componentDidMount() {
    this.initTooltip();
  }

  componentWillReceiveProps(props) {
    if (props.text !== this.props.text && this.tooltip) {
      this.tooltip.updateTitleContent(props.text);
    }
  }

  shouldComponentUpdate() {
    return false;
  }

  componentWillUnmount() {
    this.destroyTooltip();
  }

  initTooltip() {
    const { position, text, show, insideTooltip, isInModal } = this.props;

    const template = isInModal
      ? {
          template:
            '<div class="tooltip-modal"><div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div></div>'
        }
      : {};
    this.tooltip = new Tooltip(this.element, {
      trigger: typeof show !== 'undefined' ? '' : 'hover focus',
      title: text,
      placement: position,
      container: 'body',
      boundariesElement: insideTooltip ? 'scrollParent' : 'window',
      offset: '1, 1',
      ...template
    });

    if (typeof show !== 'undefined') {
      if (show) {
        this.tooltip.show();
      } else {
        this.tooltip.hide();
      }
    }

    // workaround for ios not closing tooltips
    const iOS = /iPhone|iPad|iPod/.test(navigator.platform) && !window.MSStream;
    if (iOS) {
      document.body.classList.add('tooltip-ios-touch');
    }
  }

  destroyTooltip() {
    if (this.tooltip) {
      this.tooltip.dispose();
    }
  }

  render() {
    const { showIcon, children, className } = this.props;
    return (
      <div
        ref={elem => {
          this.element = elem;
        }}
        className={cx('tooltip-react', className)}
      >
        {showIcon && (
          <svg className="icon tooltip-react-icon">
            <use xlinkHref="#icon-layer-info" />
          </svg>
        )}
        {children}
      </div>
    );
  }
}

TooltipComponent.propTypes = {
  show: PropTypes.bool,
  text: PropTypes.string,
  children: PropTypes.any,
  showIcon: PropTypes.bool,
  insideTooltip: PropTypes.bool,
  position: PropTypes.string,
  className: PropTypes.string,
  isInModal: PropTypes.bool
};

TooltipComponent.defaultProps = {
  position: 'bottom',
  showIcon: true,
  insideTooltip: false
};
