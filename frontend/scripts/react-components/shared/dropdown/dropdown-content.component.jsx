import React, { useMemo, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import DropdownContext from 'react-components/shared/dropdown/dropdown.context';
import DropdownItem from 'react-components/shared/dropdown/dropdown-item.component';

function useClipItemList(props) {
  const DEFAULT_MAX_LIST_HEIGHT = 212;
  const { options, clip, showSelected } = props;
  const ref = useRef(null);
  const [listHeight, updateListHeight] = useState(null);
  useEffect(() => {
    if (ref.current && listHeight === null && options && options.length > 0 && clip) {
      const { height } = ref.current.getBoundingClientRect();
      const optionsLength = showSelected ? options.length : options.length - 1;
      if (height > 0 && height * optionsLength > DEFAULT_MAX_LIST_HEIGHT) {
        const newListHeight = height * 6 - height / 2;
        updateListHeight(newListHeight);
      }
    }
  }, [listHeight, options, clip, showSelected, updateListHeight]);

  return [listHeight, ref];
}

function DropdownContent(props) {
  const {
    innerRef,
    style,
    children,
    placement,
    toggleMenu,
    selectedItem,
    getItemProps,
    getMenuProps,
    options,
    showSelected,
    highlightedIndex,
    readOnly,
    getItemClassName,
    variant
  } = props;

  const [listHeight, listItemRef] = useClipItemList(props);

  const providerValue = useMemo(
    () => ({
      selectedItem,
      getItemProps,
      highlightedIndex,
      toggleMenu
    }),
    [selectedItem, getItemProps, highlightedIndex, toggleMenu]
  );

  const decoratedChildren =
    typeof children !== 'undefined' ? (
      <DropdownContext.Provider value={providerValue}>{children}</DropdownContext.Provider>
    ) : (
      undefined
    );

  let content = decoratedChildren;

  if (options) {
    const optionsToShow = showSelected
      ? options
      : options.filter(o => o.value !== selectedItem?.value);

    content = optionsToShow.map((item, i) => (
      <DropdownItem
        item={item}
        index={i}
        key={item.id || item.value}
        highlightedIndex={highlightedIndex}
        getItemProps={getItemProps}
        readOnly={readOnly}
        getItemClassName={getItemClassName}
        variant={variant}
        listItemRef={listItemRef}
      />
    ));
  }

  const styleToApply = listHeight ? { ...style, height: listHeight } : style;

  return (
    <ul
      {...getMenuProps({
        ref: innerRef,
        style: styleToApply,
        'data-placement': placement,
        className: 'dropdown-menu'
      })}
    >
      {content}
    </ul>
  );
}

DropdownContent.propTypes = {
  clip: PropTypes.bool,
  innerRef: PropTypes.any.isRequired,
  style: PropTypes.object.isRequired,
  children: PropTypes.any,
  placement: PropTypes.string,
  toggleMenu: PropTypes.func.isRequired,
  selectedItem: PropTypes.object,
  getItemProps: PropTypes.func.isRequired,
  getMenuProps: PropTypes.func.isRequired,
  options: PropTypes.array,
  showSelected: PropTypes.bool,
  highlightedIndex: PropTypes.number,
  readOnly: PropTypes.bool,
  getItemClassName: PropTypes.func,
  variant: PropTypes.string.isRequired
};

export default React.memo(DropdownContent);
