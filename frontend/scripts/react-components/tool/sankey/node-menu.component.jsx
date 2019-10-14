import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Text from 'react-components/shared/text';

import './node-menu.scss';

const ITEM_HEIGHT = 33;

function NodeMenu(props) {
  const { options, menuPos, isVisible, containerRef } = props;
  const menuHeight = useMemo(() => ITEM_HEIGHT * options?.length, [options]);
  const flipped = useMemo(() => {
    const nodeContainerHeight = containerRef.current?.getBoundingClientRect().height;
    const menuBottom = menuPos.y + menuHeight;
    return menuBottom > nodeContainerHeight;
  }, [containerRef, menuHeight, menuPos.y]);

  return (
    <div
      className={cx('c-node-menu', { '-visible': isVisible })}
      style={{ left: `${menuPos.x}px`, top: `${menuPos.y}px` }}
    >
      <svg className="icon icon-outside-link">
        <use xmlnsXlink="http://www.w3.org/1999/xlink" xlinkHref="#icon-more-options" />
      </svg>
      <ul
        className={cx('options', { flipped })}
        style={{ top: `${flipped ? 32 - menuHeight : 2}px` }}
      >
        {options.map((option, i) => (
          <li key={option.id} className={cx('menu-item', option.className)}>
            <button className="menu-item-button" onClick={option.onClick}>
              <Text color="grey" variant="mono" weight="light">
                {option.label?.toUpperCase()}
              </Text>
              {i === 0 && (
                <svg className="icon">
                  <use xlinkHref="#icon-more-options" />
                </svg>
              )}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

NodeMenu.propTypes = {
  options: PropTypes.array,
  menuPos: PropTypes.shape({ x: PropTypes.number, y: PropTypes.number }),
  isVisible: PropTypes.bool,
  containerRef: PropTypes.node
};

export default React.memo(NodeMenu);
