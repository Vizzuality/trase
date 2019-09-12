import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import HelpTooltip from '../help-tooltip/help-tooltip.component';

import './grid-list-item.scss';

function GridListItem(props) {
  const {
    item,
    style,
    isGroup,
    tooltip,
    isActive,
    isDisabled,
    enableItem,
    disableItem,
    onInfoClick,
    onHover,
    isInfoActive,
    variant
  } = props;
  if (!item) return <b style={style} />;
  const onClick = isActive && disableItem ? disableItem : enableItem;
  const testId = item.name && item.name.split(' ').join('-');
  return (
    <React.Fragment>
      <div style={style} className={cx('c-grid-list-item', { [`v-${variant}`]: variant })}>
        {isGroup && <h3 className="grid-list-item-heading">{item.name}</h3>}
        {!isGroup && (
          <div className="grid-list-item-content" data-test="grid-list-item-button">
            <button
              type="button"
              disabled={isDisabled}
              onClick={() => onClick(item)}
              onMouseEnter={onHover ? () => onHover(item) : undefined}
              onMouseLeave={onHover ? () => onHover(null) : undefined}
              className={cx('grid-list-item-button', {
                '-active': isActive,
                '-has-info': !!tooltip,
                '-clickable': isActive && !disableItem
              })}
              data-test={`grid-list-item-button-${testId}`}
            >
              <span>{item.name}</span>
            </button>
            {tooltip && (
              <div
                className={cx('grid-list-item-info', {
                  '-active': isInfoActive
                })}
              >
                <HelpTooltip
                  text={tooltip}
                  showIcon={false}
                  trigger="click"
                  show={isInfoActive}
                  position="bottom-start"
                  insideTooltip
                >
                  <button type="button" disabled={isDisabled} onClick={() => onInfoClick(item)}>
                    i
                  </button>
                </HelpTooltip>
              </div>
            )}
          </div>
        )}
      </div>
    </React.Fragment>
  );
}

GridListItem.propTypes = {
  item: PropTypes.object,
  isGroup: PropTypes.bool,
  isActive: PropTypes.bool,
  tooltip: PropTypes.string,
  isDisabled: PropTypes.bool,
  enableItem: PropTypes.func,
  disableItem: PropTypes.func,
  onInfoClick: PropTypes.func,
  onHover: PropTypes.func,
  isInfoActive: PropTypes.bool,
  style: PropTypes.object.isRequired,
  variant: PropTypes.string
};

export default GridListItem;
