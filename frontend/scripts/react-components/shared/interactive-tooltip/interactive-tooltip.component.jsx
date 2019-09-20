/* eslint-disable jsx-a11y/mouse-events-have-key-events */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import tippy from 'tippy.js';

import './interactive-tooltip.scss';

export default class InteractiveTooltipComponent extends Component {
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
    const { text } = this.props;

    this.tooltip = tippy(this.element, {
      content: text,
      arrow: true,
      interactive: true,
      duration: 0,
      theme: 'blue'
    });
  }

  destroyTooltip() {
    if (this.tooltip) {
      this.tooltip.destroy();
    }
  }

  render() {
    const { showIcon, children } = this.props;
    return (
      <div
        ref={elem => {
          this.element = elem;
        }}
        className={cx('tooltip-react', this.props.className)}
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

InteractiveTooltipComponent.propTypes = {
  text: PropTypes.string,
  children: PropTypes.any,
  showIcon: PropTypes.bool,
  className: PropTypes.string
};

InteractiveTooltipComponent.defaultProps = {
  showIcon: true
};
