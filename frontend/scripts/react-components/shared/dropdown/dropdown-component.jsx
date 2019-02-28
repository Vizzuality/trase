import React from 'react';
import PropTypes from 'prop-types';
import Downshift from 'downshift';
import cx from 'classnames';
import './dropdown.scss';

const Dropdown = ({
  options,
  value,
  onChange,
  arrowType,
  fitContent,
  selectorOverrideLabel,
  showSelected,
  theme,
  itemsDisabled,
  position
}) => {
  const getSelectedOptions = selectedItem =>
    showSelected
      ? options
      : options.filter(
          o => o.value !== (selectedItem && selectedItem.value) && o.value !== value.value
        );

  const renderItem = (item, index, getItemProps) => (
    <li
      {...getItemProps({
        item,
        index,
        key: item.value,
        disabled: itemsDisabled
      })}
      className={cx(
        'dropdown-menu-item',
        { '-with-icon': item.icon },
        { [theme['menu-item']]: theme['menu-item'] }
      )}
    >
      {item.icon && (
        <svg className={cx('icon', `icon-${item.icon}`, { [theme.icon]: theme.icon })}>
          <use xlinkHref={`#icon-${item.icon}`} />
        </svg>
      )}
      {item.label}
    </li>
  );

  return (
    <Downshift defaultValue={value} itemToString={i => i && i.label} onChange={onChange}>
      {({ getItemProps, isOpen, toggleMenu, getToggleButtonProps, selectedItem }) => (
        <div
          className={cx(
            'c-dropdown-component',
            { '-open': isOpen, '-fit-content': fitContent },
            { [theme.dropdown]: theme.dropdown }
          )}
        >
          <button
            {...getToggleButtonProps()}
            className={cx(
              'dropdown-selected-item',
              { [`-${arrowType}`]: arrowType },
              theme['selected-item']
            )}
            onClick={toggleMenu}
          >
            {selectorOverrideLabel || (selectedItem && selectedItem.label) || value.label}
          </button>
          {isOpen && options.length > 0 ? (
            <ul
              className={cx('dropdown-menu', {
                [theme.menu]: theme.menu,
                [`-${position}`]: position
              })}
            >
              {getSelectedOptions(selectedItem).map((item, index) =>
                renderItem(item, index, getItemProps, itemsDisabled)
              )}
            </ul>
          ) : null}
        </div>
      )}
    </Downshift>
  );
};

Dropdown.propTypes = {
  options: PropTypes.array,
  value: PropTypes.shape({
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    icon: PropTypes.string
  }),
  onChange: PropTypes.func.isRequired,
  arrowType: PropTypes.string,
  selectorOverrideLabel: PropTypes.string,
  fitContent: PropTypes.bool,
  showSelected: PropTypes.bool,
  itemsDisabled: PropTypes.bool,
  theme: PropTypes.object,
  position: PropTypes.string
};

Dropdown.defaultProps = {
  options: [],
  value: undefined,
  arrowType: undefined,
  fitContent: false,
  selectorOverrideLabel: undefined,
  showSelected: false,
  itemsDisabled: false,
  theme: {},
  position: undefined
};

export default Dropdown;
