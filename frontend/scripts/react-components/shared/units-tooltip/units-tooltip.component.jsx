import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import isEqual from 'lodash/isEqual';

import './units-tooltip.scss';

class UnitsTooltip extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = { position: null };

    this.getRef = this.getRef.bind(this);
  }

  componentDidMount() {
    this.updatePosition();
  }

  componentDidUpdate() {
    this.updatePosition();
  }

  getPosition() {
    const { x, y } = this.props;

    if (!this.el || x === undefined || y === undefined) return null;

    const canDisplayOnRight = x < document.documentElement.clientWidth - this.el.clientWidth - 10;
    const canDisplayOnBottom =
      y < document.documentElement.clientHeight - this.el.clientHeight - 10;
    const leftPos = canDisplayOnRight ? x + 10 : x - this.el.clientWidth - 10;
    const topPos = canDisplayOnBottom ? y + 10 : y - this.el.clientHeight - 10;

    const left = Number.isNaN(leftPos) ? 0 : leftPos;
    const top = Number.isNaN(topPos) ? 0 : topPos;
    return { left, top };
  }

  getRef(el) {
    this.el = el;
  }

  updatePosition() {
    const newPosition = this.getPosition();
    const { position } = this.state;

    if (!isEqual(position, newPosition)) {
      this.setState({ position: newPosition });
    }
  }

  render() {
    const { className, text, items = [], show } = this.props;
    const { position } = this.state;
    const { top, left } = position || {};
    const visibility = show && position ? 'visible' : 'hidden';

    return (
      <div
        ref={this.getRef}
        className={cx('c-units-tooltip', className)}
        style={{ left, top, visibility }}
      >
        <div className="units-tooltip-text">{text}</div>
        {items.map(item => (
          <div key={item.title} className="units-tooltip-value">
            <div className="units-tooltip-title">{item.title}</div>
            <div className="units-tooltip-data">
              {item.value}
              {item.unit && <span className="units-tooltip-value-unit"> {item.unit}</span>}
            </div>
          </div>
        ))}
      </div>
    );
  }
}

UnitsTooltip.propTypes = {
  className: PropTypes.string,
  x: PropTypes.number,
  y: PropTypes.number,
  text: PropTypes.string,
  items: PropTypes.array,
  show: PropTypes.bool
};

export default UnitsTooltip;
