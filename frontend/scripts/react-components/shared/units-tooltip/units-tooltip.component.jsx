import React, { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Text from 'react-components/shared/text';

import './units-tooltip.scss';

function UnitsTooltip(props) {
  const { className, text, items, show, x, y, height, width } = props;
  const ref = useRef(null);
  const [position, setPosition] = useState({
    left: 0,
    top: 0
  });

  useEffect(() => {
    if (ref.current && typeof x !== 'undefined' && typeof y !== 'undefined') {
      const w = width || document.documentElement.clientHeight;
      const h = height || document.documentElement.clientWidth;

      const canDisplayOnRight = ref.current && x < w - ref.current.clientWidth - 10;
      const canDisplayOnBottom = ref.current && y < h - ref.current.clientHeight - 10;

      const leftPos = canDisplayOnRight ? x + 10 : x - ref.current?.clientWidth - 10;
      const topPos = canDisplayOnBottom ? y + 10 : y - ref.current?.clientHeight - 10;
      const newPosition = {
        left: Number.isNaN(leftPos) ? 0 : leftPos,
        top: Number.isNaN(topPos) ? 0 : topPos
      };
      setPosition(newPosition);
    }
  }, [x, y, width, height, text, setPosition]);

  const visibility = show ? 'visible' : 'hidden';

  return (
    <div
      ref={ref}
      className={cx('c-units-tooltip', className)}
      style={{
        transform: `translate(${position ? position.left : undefined}px, ${
          position ? position.top : undefined
        }px)`,
        visibility
      }}
    >
      <Text variant="sans" size="sm" weight="bold" className="units-tooltip-text">
        {text}
      </Text>
      {items.map(item => (
        <div key={`units-tooltip-${item.title}`} className="units-tooltip-value">
          <Text
            as="div"
            variant="mono"
            size="sm"
            color="grey-faded"
            weight="light"
            transform="uppercase"
            className="units-tooltip-unit"
          >
            {item.title}
          </Text>
          {item.value && (
            <Text variant="sans" size="sm" weight="bold" className="units-tooltip-data">
              {item.value} {item.unit}
            </Text>
          )}
          {!item.value && item.children}
        </div>
      ))}
    </div>
  );
}

UnitsTooltip.defaultProps = {
  items: []
};

UnitsTooltip.propTypes = {
  className: PropTypes.string,
  x: PropTypes.number,
  y: PropTypes.number,
  height: PropTypes.number,
  width: PropTypes.number,
  text: PropTypes.string,
  items: PropTypes.array,
  show: PropTypes.bool
};

export default React.memo(UnitsTooltip);
