import React, { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Downshift from 'downshift';
import { Manager, Reference, Popper } from 'react-popper';

import cx from 'classnames';
import './dropdown.scss';
import './dropdown-nav.variant.scss';
import './dropdown-sentence.variant.scss';
import './dropdown-column.variant.scss';
import './dropdown-panel.variant.scss';
import DropdownContent from 'react-components/shared/dropdown/dropdown-content.component';
import DropdownButton from 'react-components/shared/dropdown/dropdown-button.component';

function useRenderKey(props) {
  // popper won't detect changes on its children so the necessary recalculations won't happen
  // we create a key that changes every time the options or children change, that way we remount the popper component
  const { children, options } = props;
  const ref = useRef(0);
  const [content, updateContent] = useState(options || children);
  useEffect(() => {
    const newContent = options || children;
    if (newContent !== content) {
      ref.current++;
      updateContent(() => newContent);
    }
  }, [options, children, content, updateContent]);
  return ref;
}

function Dropdown(props) {
  const renderKey = useRenderKey(props);

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
            <Reference>
              {p => (
                <DropdownButton
                  innerRef={p.ref}
                  getToggleButtonProps={getToggleButtonProps}
                  inputValue={inputValue}
                  arrowType={props.arrowType}
                  selectedValueOverride={props.selectedValueOverride}
                  label={props.label}
                  size={props.size}
                  color={props.color}
                  tooltip={props.tooltip}
                  weight={props.weight}
                  variant={props.variant}
                  isDisabled={props.isDisabled}
                />
              )}
            </Reference>
            <Popper placement={placement} key={renderKey.current}>
              {p => (
                <DropdownContent
                  innerRef={p.ref}
                  style={p.style}
                  placement={p.placement}
                  selectedItem={selectedItem}
                  highlightedIndex={highlightedIndex}
                  getMenuProps={getMenuProps}
                  getItemProps={getItemProps}
                  toggleMenu={toggleMenu}
                  showSelected={props.showSelected}
                  options={props.options}
                  variant={props.variant}
                  getItemClassName={props.getItemClassName}
                  readOnly={props.readOnly}
                  clip={props.clip}
                >
                  {props.children}
                </DropdownContent>
              )}
            </Popper>
          </Manager>
        </div>
      )}
    </Downshift>
  );
}

Dropdown.propTypes = {
  clip: PropTypes.bool,
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
  label: PropTypes.string,
  onChange: PropTypes.func,
  size: PropTypes.string,
  arrowType: PropTypes.string,
  selectedValueOverride: PropTypes.any,
  showSelected: PropTypes.bool,
  readOnly: PropTypes.bool,
  placement: PropTypes.string,
  itemToString: PropTypes.func,
  variant: PropTypes.string,
  color: PropTypes.string,
  align: PropTypes.string,
  weight: PropTypes.string,
  tooltip: PropTypes.string,
  children: PropTypes.node,
  isDisabled: PropTypes.bool,
  getItemClassName: PropTypes.func
};

Dropdown.defaultProps = {
  clip: true,
  readOnly: false,
  showSelected: false,
  placement: 'bottom-end',
  size: 'md',
  color: 'grey',
  weight: 'bold',
  itemToString: i => i && i.label
};

export default React.memo(Dropdown);
