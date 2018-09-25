import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import HelpTooltip from 'react-components/shared/help-tooltip.component';

function GridListItem(props) {
  const { item, style, isGroup, isActive, onClick, tooltip, onInfoClick, isInfoActive } = props;
  if (!item) return <b style={style} />;
  return (
    <React.Fragment>
      <div style={style} className="c-grid-list-item">
        {isGroup && <h3 className="grid-list-item-heading">{item.name}</h3>}
        {!isGroup && (
          <div className="grid-list-item-content">
            <button
              type="button"
              onClick={() => onClick(item)}
              className={cx('grid-list-item-button', {
                '-active': isActive,
                '-has-info': !!tooltip
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
                  <button type="button" onClick={() => onInfoClick(item)}>
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
  onClick: PropTypes.func,
  isGroup: PropTypes.bool,
  isActive: PropTypes.bool,
  tooltip: PropTypes.string,
  onInfoClick: PropTypes.func,
  isInfoActive: PropTypes.bool,
  item: PropTypes.object.isRequired,
  style: PropTypes.object.isRequired
};

export default GridListItem;
