import React, { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Downshift from 'downshift';
import { Manager, Reference, Popper } from 'react-popper';
import cx from 'classnames';
import './dropdown.scss';

function Dropdown(props) {
  function renderItem(item, index, getItemProps) {
    const { readOnly } = props;
    return (
      <li
        {...getItemProps({
          item,
          index,
          key: item.value,
          disabled: readOnly,
          className: cx('dropdown-menu-item', { '-with-icon': item.icon })
        })}
      >
        {item.icon && (
          <svg className={cx('icon', `icon-${item.icon}`)}>
            <use xlinkHref={`#icon-${item.icon}`} />
          </svg>
        )}
        <span title={item.label} className="item-label">
          {item.label}
        </span>
      </li>
    );
  }

  function getOptions(selectedItem, getItemProps) {
    const { showSelected, options, value } = props;

    const optionsToShow = showSelected
      ? options
      : options.filter(
          o => o.value !== (selectedItem && selectedItem.value) && o.value !== value.value
        );

    return optionsToShow.map((item, i) => renderItem(item, i, getItemProps));
  }

  // eslint-disable-next-line react/prop-types
  function renderButton({ ref, inputValue, getToggleButtonProps }) {
    const { arrowType, selectedValueOverride } = props;
    return (
      <button
        {...getToggleButtonProps({
          ref,
          className: cx('dropdown-selected-item', { [`-${arrowType}`]: arrowType })
        })}
      >
        {selectedValueOverride || inputValue}
      </button>
    );
  }

  // eslint-disable-next-line react/prop-types
  function renderList({ ref, style, placement, getItemProps, selectedItem, getMenuProps }) {
    return (
      <ul
        {...getMenuProps({
          ref,
          style,
          'data-placement': placement,
          className: 'dropdown-menu'
        })}
      >
        {getOptions(selectedItem, getItemProps)}
      </ul>
    );
  }

  const {
    value,
    onChange,
    itemToString,
    color,
    variant,
    readOnly,
    placement,
    options,
    children
  } = props;

  // popper won't detect changes on its children so the necessary recalculations won't happen
  // we create a key that changes every time the options or children change, that way we remount the popper component
  const popperForceUpdateKey = useRef(0);
  const [content, updateContent] = useState(options || children);
  useEffect(() => {
    const newContent = options || children;
    if (newContent !== content) {
      updateContent(newContent);
      popperForceUpdateKey.current++;
    }
  }, [options, children, content]);

  return (
    <Downshift initialSelectedItem={value} itemToString={itemToString} onChange={onChange}>
      {({ getItemProps, isOpen, getToggleButtonProps, selectedItem, inputValue, getMenuProps }) => (
        <div
          className={cx('c-dropdown-component', {
            '-open': isOpen,
            [`v-${variant}`]: variant,
            [`color-${color}`]: color,
            '-read-only': readOnly
          })}
        >
          <Manager>
            <Reference>{p => renderButton({ ...p, getToggleButtonProps, inputValue })}</Reference>
            <Popper placement={placement} key={popperForceUpdateKey.current}>
              {p => renderList({ ...p, selectedItem, getMenuProps, getItemProps })}
            </Popper>
          </Manager>
        </div>
      )}
    </Downshift>
  );
}

Dropdown.propTypes = {
  options: PropTypes.array,
  value: PropTypes.shape({
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    icon: PropTypes.string
  }),
  onChange: PropTypes.func,
  arrowType: PropTypes.string, // eslint-disable-line
  selectedValueOverride: PropTypes.string, // eslint-disable-line
  showSelected: PropTypes.bool,
  readOnly: PropTypes.bool,
  placement: PropTypes.string,
  itemToString: PropTypes.func,
  variant: PropTypes.string,
  color: PropTypes.string,
  children: PropTypes.node
};

Dropdown.defaultProps = {
  readOnly: false,
  showSelected: false,
  placement: 'bottom-end',
  itemToString: i => i && i.label
};

export default Dropdown;
