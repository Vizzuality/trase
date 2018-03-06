/* eslint-disable jsx-a11y/mouse-events-have-key-events */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Tooltip from 'tooltip.js';

import 'styles/components/shared/help-tooltip.scss';

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
    const { position, text } = this.props;

    this.tooltip = new Tooltip(this.element, {
      title: text,
      placement: position,
      container: 'body',
      boundariesElement: 'window',
      offset: '1, 1'
    });

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
    return (
      <div
        ref={elem => {
          this.element = elem;
        }}
        className={cx('tooltip-react', this.props.className)}
      >
        <svg className="icon tooltip-react-icon">
          <use xlinkHref="#icon-layer-info" />
        </svg>
      </div>
    );
  }
}

TooltipComponent.propTypes = {
  className: PropTypes.string,
  text: PropTypes.string,
  position: PropTypes.string
};

TooltipComponent.defaultProps = {
  position: 'bottom'
};
