import React from 'react';
import cx from 'classnames';
import kebabCase from 'lodash/kebabCase';
import Tooltip from 'react-components/shared/help-tooltip/help-tooltip.component';
import Text from 'react-components/shared/text';
import PropTypes from 'prop-types';

function DropdownItem(props) {
  const {
    item,
    index,
    highlightedIndex,
    getItemProps,
    readOnly,
    getItemClassName,
    variant,
    listItemRef
  } = props;

  const itemCustomClassName = getItemClassName && getItemClassName(item);
  const itemTextProps =
    {
      column: { variant: 'sans', size: 'rg' }
    }[variant] || {};
  return (
    <>
      {item.hasSeparator && <li className="dropdow-menu-separator" />}
      <li
        {...getItemProps({
          item,
          index,
          disabled: readOnly || item.isDisabled,
          className: cx('dropdown-menu-item', itemCustomClassName, {
            '-with-icon': item.icon,
            '-disabled': item.isDisabled,
            '-highlighted': highlightedIndex === index
          }),
          'data-test': `dropdown-menu-item-${kebabCase(item.label)}`,
          ref: index === 0 ? listItemRef : undefined
        })}
      >
        {item.icon && (
          <svg className={cx('dropdown-menu-item-icon', 'icon', `icon-${item.icon}`)}>
            <use xlinkHref={`#icon-${item.icon}`} />
          </svg>
        )}
        <Text
          title={item.label}
          weight="regular"
          className="item-label"
          transform="uppercase"
          {...itemTextProps}
        >
          {item.label}
        </Text>
        {item.tooltip && (
          <Tooltip className="dropdown-menu-item-tooltip" constraint="window" text={item.tooltip} />
        )}
      </li>
    </>
  );
}

DropdownItem.propTypes = {
  item: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  highlightedIndex: PropTypes.number,
  getItemProps: PropTypes.func.isRequired,
  readOnly: PropTypes.bool,
  getItemClassName: PropTypes.func,
  variant: PropTypes.string,
  listItemRef: PropTypes.any
};

export default React.memo(DropdownItem);
