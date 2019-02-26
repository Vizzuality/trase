import React from 'react';
import PropTypes from 'prop-types';
import Downshift from 'downshift';
import cx from 'classnames';
import './dropdown.scss';

const Dropdown = ({ options, value, onChange, arrowType, fitContent, selectorOverrideLabel }) => (
  <Downshift defaultValue={value} itemToString={i => i && i.label} onChange={onChange}>
    {({ getItemProps, isOpen, toggleMenu, getToggleButtonProps, selectedItem }) => (
      <div className={cx('c-dropdown-component', { '-open': isOpen, '-fit-content': fitContent })}>
        <button
          {...getToggleButtonProps()}
          className={cx('dropdown-selected-item', { [`-${arrowType}`]: arrowType })}
          onClick={toggleMenu}
        >
          {selectorOverrideLabel || (selectedItem && selectedItem.label) || value.label}
        </button>
        {isOpen && options.length > 0 ? (
          <ul className="dropdown-menu">
            {options
              .filter(
                o => o.value !== (selectedItem && selectedItem.value) && o.value !== value.value
              )
              .map((item, index) => (
                <li
                  {...getItemProps({
                    item,
                    index,
                    key: item.value
                  })}
                  className={cx('dropdown-menu-item', { '-with-icon': item.icon })}
                >
                  {item.icon && (
                    <svg className={cx('icon', `#icon-${item.icon}`)}>
                      <use xlinkHref={`#icon-${item.icon}`} />
                    </svg>
                  )}
                  {item.label}
                </li>
              ))}
          </ul>
        ) : null}
      </div>
    )}
  </Downshift>
);

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
  fitContent: PropTypes.bool
};

Dropdown.defaultProps = {
  options: [],
  value: undefined,
  arrowType: undefined,
  fitContent: false,
  selectorOverrideLabel: undefined
};

export default Dropdown;
