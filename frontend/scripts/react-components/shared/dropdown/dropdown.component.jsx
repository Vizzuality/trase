import React from 'react';
import PropTypes from 'prop-types';
import Downshift from 'downshift';
import { Manager, Reference, Popper } from 'react-popper';
import cx from 'classnames';
import './dropdown.scss';

class Dropdown extends React.Component {
  renderItem(item, index, getItemProps) {
    const { theme, readOnly } = this.props;
    return (
      <li
        {...getItemProps({
          item,
          index,
          key: item.value,
          disabled: readOnly
        })}
        className={cx('dropdown-menu-item', { '-with-icon': item.icon })}
      >
        {item.icon && (
          <svg className={cx('icon', `icon-${item.icon}`, { [theme.icon]: theme.icon })}>
            <use xlinkHref={`#icon-${item.icon}`} />
          </svg>
        )}
        <span title={item.label} className="item-label">
          {item.label}
        </span>
      </li>
    );
  }

  getSelectedOptions(selectedItem) {
    const { readOnly, showSelected, options, value } = this.props;

    return readOnly || showSelected
      ? options
      : options.filter(
          o => o.value !== (selectedItem && selectedItem.value) && o.value !== value.value
        );
  }

  renderButton = ({ ref, toggleMenu, inputValue, getToggleButtonProps }) => {
    const { arrowType, selectedValueOverride } = this.props;

    return (
      <button
        {...getToggleButtonProps()}
        ref={ref}
        className={cx('dropdown-selected-item', { [`-${arrowType}`]: arrowType })}
        onClick={toggleMenu}
      >
        {selectedValueOverride || inputValue}
      </button>
    );
  };

  renderBox = ({ ref, style, placement, getItemProps, selectedItem }) => (
    <ul ref={ref} style={style} data-placement={placement} className="dropdown-menu">
      {this.getSelectedOptions(selectedItem).map((item, index) =>
        this.renderItem(item, index, getItemProps)
      )}
    </ul>
  );

  render() {
    const {
      options,
      value,
      onChange,
      itemToString,
      color,
      variant,
      readOnly,
      placement
    } = this.props;
    return (
      <Downshift defaultSelectedItem={value} itemToString={itemToString} onChange={onChange}>
        {({ getItemProps, isOpen, toggleMenu, getToggleButtonProps, selectedItem, inputValue }) => (
          <div
            className={cx('c-dropdown-component', {
              '-open': isOpen,
              [`v-${variant}`]: variant,
              [`color-${color}`]: color,
              '-read-only': readOnly
            })}
          >
            <Manager>
              <Reference>
                {props =>
                  this.renderButton({ ...props, toggleMenu, getToggleButtonProps, inputValue })
                }
              </Reference>
              {isOpen && options.length > 0 ? (
                <Popper placement={placement || 'bottom-end'}>
                  {props => this.renderBox({ ...props, getItemProps, selectedItem })}
                </Popper>
              ) : null}
            </Manager>
          </div>
        )}
      </Downshift>
    );
  }
}

Dropdown.propTypes = {
  options: PropTypes.array,
  value: PropTypes.shape({
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    icon: PropTypes.string
  }),
  onChange: PropTypes.func,
  arrowType: PropTypes.string,
  selectedValueOverride: PropTypes.string,
  showSelected: PropTypes.bool,
  readOnly: PropTypes.bool,
  theme: PropTypes.object,
  placement: PropTypes.string,
  itemToString: PropTypes.func,
  variant: PropTypes.string,
  color: PropTypes.string
};

Dropdown.defaultProps = {
  options: [],
  showSelected: false,
  readOnly: false,
  theme: {},
  itemToString: i => i && i.label
};

export default Dropdown;
