/* eslint-disable jsx-a11y/mouse-events-have-key-events */
import React, { Component } from 'react';
import classNames from 'classnames';
import 'styles/components/shared/help-tooltip-react.scss';
import PropTypes from 'prop-types';

export default class Tooltip extends Component {
  constructor(props) {
    super(props);
    this.onOverBound = this.onOver.bind(this);
    this.onOutBound = this.onOut.bind(this);
    this.state = { visible: false };
  }

  onOver() {
    this.setState({ visible: true });
  }

  onOut() {
    this.setState({ visible: false });
  }

  render() {
    const { text, position, floating } = this.props;
    return (
      <div
        className={classNames('tooltip-react', position, { '-floating': floating })}
        onMouseOver={this.onOverBound}
        onMouseOut={this.onOutBound}
      >
        <svg className="icon tooltip-react-icon">
          <use xlinkHref="#icon-layer-info" />
        </svg>
        {this.state.visible && <div className="tooltip-react-content">{text}</div>}
      </div>
    );
  }
}

Tooltip.propTypes = {
  text: PropTypes.string,
  position: PropTypes.string,
  floating: PropTypes.bool
};
