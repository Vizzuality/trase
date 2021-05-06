import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import HelpTooltip from 'react-components/shared/help-tooltip/help-tooltip.component';
import Heading from 'react-components/shared/heading';
import Text from 'react-components/shared/text';

import './grid-list-item.scss';

function WrapWithTooltip({ tooltip, wrap, children }) {
  if (wrap) {
    return (
      <HelpTooltip theme="black-padding" showInfoIcon={false} className="size-sm" text={tooltip}>
        {children}
      </HelpTooltip>
    );
  }
  return children;
}

function GridListItem(props) {
  const {
    item,
    style,
    isGroup,
    tooltip,
    tooltipCover = false,
    isActive,
    isDisabled,
    enableItem,
    disableItem,
    onInfoClick,
    onHover,
    isInfoActive,
    variant,
    color
  } = props;
  if (!item) return <b style={style} />;
  const onClick = isActive && disableItem ? disableItem : enableItem;
  const testId = item.name && item.name.split(' ').join('-');
  const isToggleAll = item.id === 'TOGGLE_ALL';
  return (
    <React.Fragment>
      <div
        style={style}
        className={cx('c-grid-list-item', {
          [`v-${variant}`]: variant,
          [`color-${color}`]: color
        })}
      >
        {isGroup && (
          <Heading as="h3" weight="regular" className="grid-list-item-heading">
            {item.name}
          </Heading>
        )}
        {!isGroup && (
          <div
            className="grid-list-item-content"
            data-test={isToggleAll ? 'grid-list-item-toggle-all' : 'grid-list-item-button'}
          >
            <WrapWithTooltip tooltip={tooltip} wrap={tooltip && tooltipCover}>
              <button
                type="button"
                disabled={isDisabled}
                onClick={isToggleAll ? item.setExcludingMode : () => onClick(item)}
                onMouseEnter={onHover && !isToggleAll ? () => onHover(item) : undefined}
                onMouseLeave={onHover && !isToggleAll ? () => onHover(null) : undefined}
                className={cx('grid-list-item-button', {
                  '-active': !isToggleAll && isActive,
                  '-has-info': !isToggleAll && !!tooltip && !tooltipCover
                })}
                data-test={`grid-list-item-button-${testId}`}
              >
                <Text
                  as="p"
                  variant="mono"
                  weight="bold"
                  align="center"
                  title={item.name}
                  transform="capitalize"
                  className="grid-list-item-text"
                >
                  {item.name}
                </Text>
              </button>
            </WrapWithTooltip>
            {tooltip && !tooltipCover && (
              <div
                className={cx('grid-list-item-info', {
                  '-item-active': !isToggleAll && isActive,
                  '-active': isInfoActive
                })}
                disabled={isDisabled}
              >
                <HelpTooltip
                  text={tooltip}
                  referenceComponent={forwardRef((_, ref) => (
                    <button
                      ref={ref}
                      type="button"
                      onClick={() => onInfoClick && onInfoClick(item)}
                    >
                      i
                    </button>
                  ))}
                />
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
  color: PropTypes.string,
  isActive: PropTypes.bool,
  tooltip: PropTypes.string,
  tooltipCover: PropTypes.bool,
  isDisabled: PropTypes.bool,
  enableItem: PropTypes.func,
  disableItem: PropTypes.func,
  onInfoClick: PropTypes.func,
  onHover: PropTypes.func,
  isInfoActive: PropTypes.bool,
  style: PropTypes.object,
  variant: PropTypes.string
};

export default GridListItem;
