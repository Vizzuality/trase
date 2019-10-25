import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Text from 'react-components/shared/text';

import './node-menu.scss';

const ITEM_HEIGHT = 33;

function NodeMenu(props) {
  const { options, menuPos, isVisible, containerRef } = props;
  const menuHeight = ITEM_HEIGHT * options?.length;
  const nodeContainerHeight = containerRef.current?.getBoundingClientRect().height;
  const menuBottom = menuPos.y + menuHeight;
  const mirrorX = menuPos.x < 200;
  const mirrorY = menuBottom > nodeContainerHeight;

  return (
    <div
      className={cx('c-node-menu', { '-visible': isVisible })}
      style={{ left: `${menuPos.x}px`, top: `${menuPos.y}px` }}
    >
      <svg className="icon icon-outside-link">
        <use xmlnsXlink="http://www.w3.org/1999/xlink" xlinkHref="#icon-more-options" />
      </svg>
      <ul
        className={cx('options', { mirrorY, mirrorX })}
        style={{ top: `${mirrorY ? 32 - menuHeight : 2}px`, left: mirrorX ? 0 : undefined }}
      >
        {options.map((option, i) => (
          <li key={option.id} className={cx('menu-item', option.className)}>
            <button className="menu-item-button" onClick={option.onClick}>
              <Text color="grey" variant="mono" weight="light" className="option-text">
                {option.label?.toUpperCase()}
              </Text>
              {i === 0 && (
                <svg className="icon option-icon">
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
