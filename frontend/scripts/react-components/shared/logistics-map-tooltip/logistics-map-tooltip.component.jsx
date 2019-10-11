import React, { useRef, useMemo } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import './logistics-map-tooltip.scss';

function LogisticsMapTooltip(props) {
  const { className, text, items, show, x, y } = props;
  const ref = useRef(null);
  const position = useMemo(() => {
    if (!ref.current || typeof x === 'undefined' || typeof y === 'undefined') {
      return null;
    }

    const canDisplayOnRight =
      x < document.documentElement.clientWidth - ref.current.clientWidth - 10;
    const canDisplayOnBottom =
      y < document.documentElement.clientHeight - ref.current.clientHeight - 10;
    const leftPos = canDisplayOnRight ? x + 10 : x - ref.current.clientWidth - 10;
    const topPos = canDisplayOnBottom ? y + 10 : y - ref.current.clientHeight - 10;

    return {
      left: Number.isNaN(leftPos) ? 0 : leftPos,
      top: Number.isNaN(topPos) ? 0 : topPos
    };
  }, [x, y]);

  const visibility = show ? 'visible' : 'hidden';

  return (
    <div
      ref={ref}
      className={cx('c-logistics-map-tooltip', className)}
      style={{
        left: position ? position.left : undefined,
        top: position ? position.top : undefined,
        visibility
      }}
    >
      <div className="logistics-map-tooltip-text">{text}</div>
      {items.map(item => (
        <div key={item.title} className="logistics-map-tooltip-value">
          <div className="logistics-map-tooltip-title">{item.title}</div>
          <div className="logistics-map-tooltip-data">
            {item.value}
            {item.unit && <span className="logistics-map-tooltip-value-unit"> {item.unit}</span>}
          </div>
        </div>
      ))}
    </div>
  );
}

LogisticsMapTooltip.defaultProps = {
  items: []
};

LogisticsMapTooltip.propTypes = {
  className: PropTypes.string,
  x: PropTypes.number,
  y: PropTypes.number,
  text: PropTypes.string,
  items: PropTypes.array,
  show: PropTypes.bool
};

export default React.memo(LogisticsMapTooltip);
