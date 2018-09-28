import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import HelpTooltip from 'react-components/shared/help-tooltip.component';

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
    isInfoActive
  } = props;
  if (!item) return <b style={style} />;
  const onClick = isActive && disableItem ? disableItem : enableItem;
  return (
    <React.Fragment>
      <div style={style} className="c-grid-list-item">
        {isGroup && <h3 className="grid-list-item-heading">{item.name}</h3>}
        {!isGroup && (
          <div className="grid-list-item-content">
            <button
              type="button"
              disabled={isDisabled}
              onClick={() => onClick(item)}
              className={cx('grid-list-item-button', {
                '-active': isActive,
                '-has-info': !!tooltip,
                '-clickable': isActive && !disableItem
              })}
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
  isInfoActive: PropTypes.bool,
  style: PropTypes.object.isRequired
};

export default GridListItem;
