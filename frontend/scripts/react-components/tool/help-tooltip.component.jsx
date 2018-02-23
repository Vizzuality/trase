/* eslint-disable jsx-a11y/mouse-events-have-key-events */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TetherComponent from 'react-tether';
import classNames from 'classnames';
import 'styles/components/shared/help-tooltip-react.scss';

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
    const { text, constraint, floating } = this.props;
    return (
      <TetherComponent
        attachment="top center"
        constraints={[
          {
            to: constraint,
            pin: true,
            attachment: 'together'
          }
        ]}
        classPrefix="tooltip"
      >
        <div
          className={classNames('tooltip-react', { '-floating': floating })}
          onMouseOver={this.onOverBound}
          onMouseOut={this.onOutBound}
        >
          <svg className="icon tooltip-react-icon">
            <use xlinkHref="#icon-layer-info" />
          </svg>
        </div>
        {this.state.visible && <div className="tooltip-react-content">{text}</div>}
      </TetherComponent>
    );
  }
}

Tooltip.propTypes = {
  text: PropTypes.string,
  constraint: PropTypes.string,
  floating: PropTypes.bool
};

Tooltip.defaultProps = {
  constraint: 'scrollParent'
};
