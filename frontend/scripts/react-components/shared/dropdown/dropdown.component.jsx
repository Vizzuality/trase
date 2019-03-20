import React, { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Downshift from 'downshift';
import { Manager, Reference, Popper } from 'react-popper';
import DropdownContext from 'react-components/shared/dropdown/dropdown.context';
import Text from 'react-components/shared/text';
import Heading from 'react-components/shared/heading/heading.component';
import cx from 'classnames';
import './dropdown.scss';

function Dropdown(props) {
  const listItemRef = useRef(null);
  const [listHeight, updateListHeight] = useState(null);
  useEffect(() => {
    if (listItemRef.current && listHeight === null && props.options && props.options.length > 0) {
      const { height } = listItemRef.current.getBoundingClientRect();
      const optionsLength = props.showSelected ? props.options.length : props.options.length - 1;
      if (height > 0 && height * optionsLength > Dropdown.DEFAULT_MAX_LIST_HEIGHT) {
        const newListHeight = height * 6 - height / 2;
        updateListHeight(newListHeight);
      }
    }
  });

  // popper won't detect changes on its children so the necessary recalculations won't happen
  // we create a key that changes every time the options or children change, that way we remount the popper component
  const popperForceUpdateKey = useRef(0);
  const [content, updateContent] = useState(props.options || props.children);
  useEffect(() => {
    const newContent = props.options || props.children;
    if (newContent !== content) {
      updateContent(newContent);
      popperForceUpdateKey.current++;
    }
  }, [props.options, props.children, content]);

  function renderItem(item, index, highlightedIndex, getItemProps) {
    const { readOnly } = props;
    return (
      <li
        {...getItemProps({
          item,
          index,
          key: item.value,
          disabled: readOnly,
          className: cx('dropdown-menu-item', {
            '-with-icon': item.icon,
            '-highlighted': highlightedIndex === index
          }),
          ref: index === 0 ? listItemRef : undefined
        })}
      >
        {item.icon && (
          <svg className={cx('icon', `icon-${item.icon}`)}>
            <use xlinkHref={`#icon-${item.icon}`} />
          </svg>
        )}
        <Text title={item.label} weight="regular" className="item-label">
          {item.label}
        </Text>
      </li>
    );
  }

  function getOptions(selectedItem, highlightedIndex, getItemProps) {
    const { showSelected, options, value } = props;

    const optionsToShow = showSelected
      ? options
      : options.filter(
          o => o.value !== (selectedItem && selectedItem.value) && o.value !== value.value
        );

    return optionsToShow.map((item, i) => renderItem(item, i, highlightedIndex, getItemProps));
  }

  /* eslint-disable react/prop-types */
  function renderButton({ ref, inputValue, getToggleButtonProps }) {
    const { arrowType, selectedValueOverride, label, variant } = props;
    const labelProps = {
      selector: { variant: 'mono', size: 'sm', color: 'grey-faded', transform: 'uppercase' }
    }[variant];
    const valueProps = {
      selector: { size: 'md', weight: 'bold' },
      sentence: { size: 'md', color: 'grey', weight: 'bold' }
    }[variant];
    const Value = variant === 'selector' ? Heading : Text;
    return (
      <button
        {...getToggleButtonProps({
          ref,
          className: cx('dropdown-selected-item', { [`-${arrowType}`]: arrowType })
        })}
      >
        <Text {...labelProps} className="dropdown-label">
          {label}
        </Text>
        <Value as="span" {...valueProps} className="dropdown-value">
          {selectedValueOverride || inputValue}
        </Value>
      </button>
    );
  }

  function renderContent({
    ref,
    style,
    placement,
    selectedItem,
    getItemProps,
    getMenuProps,
    highlightedIndex,
    toggleMenu
  }) {
    const decoratedChildren =
      typeof props.children !== 'undefined' ? (
        <DropdownContext.Provider
          value={{ selectedItem, getItemProps, highlightedIndex, toggleMenu }}
        >
          {props.children}
        </DropdownContext.Provider>
      ) : (
        undefined
      );
    const styleToApply = listHeight ? { ...style, height: listHeight } : style;
    return (
      <ul
        {...getMenuProps({
          ref,
          style: styleToApply,
          'data-placement': placement,
          className: 'dropdown-menu'
        })}
      >
        {props.options
          ? getOptions(selectedItem, highlightedIndex, getItemProps)
          : decoratedChildren}
      </ul>
    );
  }
  /* eslint-enable react/prop-types */

  const {
    value,
    color,
    align,
    variant,
    readOnly,
    onChange,
    placement,
    initialValue,
    itemToString
  } = props;

  return (
    <Downshift
      initialSelectedItem={initialValue}
      selectedItem={value}
      itemToString={itemToString}
      onChange={onChange}
    >
      {({
        isOpen,
        getItemProps,
        selectedItem,
        getToggleButtonProps,
        getMenuProps,
        inputValue,
        highlightedIndex,
        toggleMenu
      }) => (
        <div
          className={cx('c-dropdown-component', {
            '-open': isOpen,
            [`v-${variant}`]: variant,
            [`color-${color}`]: color,
            '-read-only': readOnly,
            [`text-align-${align}`]: align
          })}
        >
          <Manager>
            <Reference>{p => renderButton({ ...p, getToggleButtonProps, inputValue })}</Reference>
            <Popper placement={placement} key={popperForceUpdateKey.current}>
              {p =>
                renderContent({
                  ...p,
                  selectedItem,
                  highlightedIndex,
                  getMenuProps,
                  getItemProps,
                  toggleMenu
                })
              }
            </Popper>
          </Manager>
        </div>
      )}
    </Downshift>
  );
}

Dropdown.DEFAULT_MAX_LIST_HEIGHT = 242;

Dropdown.propTypes = {
  options: PropTypes.array,
  value: PropTypes.shape({
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    icon: PropTypes.string
  }),
  initialValue: PropTypes.shape({
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    icon: PropTypes.string
  }),
  onChange: PropTypes.func,
  arrowType: PropTypes.string, // eslint-disable-line
  selectedValueOverride: PropTypes.any, // eslint-disable-line
  showSelected: PropTypes.bool,
  readOnly: PropTypes.bool,
  placement: PropTypes.string,
  itemToString: PropTypes.func,
  variant: PropTypes.string,
  color: PropTypes.string,
  align: PropTypes.string,
  children: PropTypes.node
};

Dropdown.defaultProps = {
  readOnly: false,
  showSelected: false,
  placement: 'bottom-end',
  variant: 'selector',
  itemToString: i => i && i.label
};

export default Dropdown;
