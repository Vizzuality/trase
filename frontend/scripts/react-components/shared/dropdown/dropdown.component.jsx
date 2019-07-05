import React, { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Downshift from 'downshift';
import { Manager, Reference, Popper } from 'react-popper';
import DropdownContext from 'react-components/shared/dropdown/dropdown.context';
import Text from 'react-components/shared/text';
import Heading from 'react-components/shared/heading/heading.component';
import Tooltip from 'react-components/shared/help-tooltip/help-tooltip.component';
import cx from 'classnames';
import kebabCase from 'lodash/kebabCase';
import './dropdown.scss';
import './dropdown-nav.variant.scss';
import './dropdown-sentence.variant.scss';
import './dropdown-column.variant.scss';

function Dropdown(props) {
  const listItemRef = useRef(null);
  const [listHeight, updateListHeight] = useState(null);
  useEffect(() => {
    if (
      listItemRef.current &&
      listHeight === null &&
      props.options &&
      props.options.length > 0 &&
      props.clip
    ) {
      const { height } = listItemRef.current.getBoundingClientRect();
      const optionsLength = props.showSelected ? props.options.length : props.options.length - 1;
      if (height > 0 && height * optionsLength > Dropdown.DEFAULT_MAX_LIST_HEIGHT) {
        const newListHeight = height * 6 - height / 2;
        updateListHeight(newListHeight);
      }
    }
  }, [listHeight, props.options, props.clip, props.showSelected, updateListHeight]);

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
  }, [props.options, props.children, content, updateContent]);

  function renderItem(item, index, highlightedIndex, getItemProps) {
    const { readOnly, getItemClassName, variant } = props;
    const itemCustomClassName = getItemClassName && getItemClassName(item);
    const itemTextProps =
      {
        column: { variant: 'mono', size: 'rg' }
      }[variant] || {};
    return (
      <>
        {item.hasSeparator && <li className="dropdow-menu-separator" />}
        <li
          {...getItemProps({
            item,
            index,
            key: item.value,
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
          <Text title={item.label} weight="regular" className="item-label" {...itemTextProps}>
            {item.label}
          </Text>
          {item.tooltip && (
            <Tooltip
              className="dropdown-menu-item-tooltip"
              constraint="window"
              text={item.tooltip}
            />
          )}
        </li>
      </>
    );
  }

  function getOptions(selectedItem, highlightedIndex, getItemProps) {
    const { showSelected, options } = props;
    const optionsToShow = showSelected
      ? options
      : options.filter(
          o => o.value !== (selectedItem && selectedItem.value) && o.value !== selectedItem.value
        );

    return optionsToShow.map((item, i) => renderItem(item, i, highlightedIndex, getItemProps));
  }

  /* eslint-disable react/prop-types */
  function renderButton({ ref, inputValue, getToggleButtonProps }) {
    const {
      arrowType,
      selectedValueOverride,
      label,
      size,
      color,
      tooltip,
      weight,
      variant,
      isDisabled
    } = props;

    const labelProps =
      {
        profiles: { size: 'rg', color: 'grey' },
        nav: { color: 'grey-faded' }
      }[variant] || {};

    const valueProps =
      {
        mono: { variant: 'mono' },
        column: { variant: 'mono', size: 'sm' }
      }[variant] || {};

    return (
      <button
        {...getToggleButtonProps({
          ref,
          disabled: isDisabled,
          className: cx('dropdown-selected-item', {
            [`-${arrowType}`]: arrowType,
            '-no-label': !label
          }),
          'data-test': `dropdown-selected-item-${kebabCase(label)}`
        })}
      >
        <Text
          as="span"
          size="sm"
          variant="mono"
          color={color}
          transform="uppercase"
          {...labelProps}
          className="dropdown-label"
        >
          {label}
          {tooltip && <Tooltip text={tooltip} constraint="window" />}
        </Text>
        <Heading
          as="span"
          size={size}
          weight={weight}
          color={color}
          title={inputValue}
          {...valueProps}
          className="dropdown-value"
        >
          {selectedValueOverride || inputValue}
        </Heading>
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
    isDisabled,
    placement,
    initialValue,
    itemToString
  } = props;
  const unstyledVariants = ['column'];
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
            [`text-align-${align}`]: align,
            '-disabled': isDisabled
          })}
        >
          <Manager>
            <Reference>{p => renderButton({ ...p, getToggleButtonProps, inputValue })}</Reference>
            <Popper placement={placement} key={popperForceUpdateKey.current}>
              {p => {
                const updatedP = unstyledVariants.includes(variant) ? { ...p, style: {} } : p;
                return renderContent({
                  ...updatedP,
                  selectedItem,
                  highlightedIndex,
                  getMenuProps,
                  getItemProps,
                  toggleMenu
                });
              }}
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
    value: PropTypes.any,
    icon: PropTypes.string,
    tooltip: PropTypes.string,
    disabled: PropTypes.bool,
    label: PropTypes.string.isRequired
  }),
  initialValue: PropTypes.shape({
    value: PropTypes.string,
    icon: PropTypes.string,
    tooltip: PropTypes.string,
    disabled: PropTypes.bool,
    label: PropTypes.string.isRequired
  }),
  onChange: PropTypes.func,
  size: PropTypes.string, // eslint-disable-line
  arrowType: PropTypes.string, // eslint-disable-line
  selectedValueOverride: PropTypes.any, // eslint-disable-line
  showSelected: PropTypes.bool,
  readOnly: PropTypes.bool,
  placement: PropTypes.string,
  itemToString: PropTypes.func,
  variant: PropTypes.string,
  color: PropTypes.string,
  align: PropTypes.string,
  weight: PropTypes.string, // eslint-disable-line
  tooltip: PropTypes.string, // eslint-disable-line
  children: PropTypes.node,
  clip: PropTypes.bool,
  isDisabled: PropTypes.bool,
  getItemClassName: PropTypes.func // eslint-disable-line
};

Dropdown.defaultProps = {
  readOnly: false,
  showSelected: false,
  placement: 'bottom-end',
  size: 'md',
  color: 'grey',
  weight: 'bold',
  clip: true,
  itemToString: i => i && i.label
};

export default React.memo(Dropdown);
