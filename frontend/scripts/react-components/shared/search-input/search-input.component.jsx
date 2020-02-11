/* eslint-disable  jsx-a11y/interactive-supports-focus */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Downshift from 'downshift';
import SearchInputResult from 'react-components/shared/search-input/search-input-result.component';
import cx from 'classnames';
import debounce from 'lodash/debounce';
import { FixedSizeList } from 'react-window';
import ShrinkingSpinner from 'react-components/shared/shrinking-spinner/shrinking-spinner.component';

import 'scripts/react-components/shared/search-input/search-input.scss';

const SEARCH_DEBOUNCE_RATE_IN_MS = 400;

class SearchInput extends PureComponent {
  static VARIANTS = ['bordered', 'slim'];

  containerRef = React.createRef();

  getContainerWidth() {
    if (this.containerRef.current) {
      const bounds = this.containerRef.current.getBoundingClientRect();
      return bounds.width;
    }
    return 150;
  }

  onInputValueChange = debounce(
    (...params) => this.props.onSearchTermChange && this.props.onSearchTermChange(...params),
    SEARCH_DEBOUNCE_RATE_IN_MS
  );

  focusInput(e) {
    const input = e.currentTarget.querySelector('input');
    if (input) input.focus();
  }

  stateReducer = (state, changes) => {
    switch (changes.type) {
      case Downshift.stateChangeTypes.clickItem:
      case Downshift.stateChangeTypes.controlledPropUpdatedSelectedItem:
      case Downshift.stateChangeTypes.keyDownEscape:
      case Downshift.stateChangeTypes.blurInput:
      case Downshift.stateChangeTypes.keyDownEnter: {
        return {
          ...changes,
          highlightedIndex: null,
          isOpen: false,
          inputValue: ''
        };
      }
      default:
        return changes;
    }
  };

  renderSearchBox = ({ getInputProps, getItemProps, isOpen, inputValue, highlightedIndex }) => {
    const {
      size,
      variant,
      className,
      isLoading,
      isDisabled,
      items,
      placeholder,
      placeholderSmall,
      testId,
      getResultTestId,
      resultClassName,
      nodeTypeRenderer
    } = this.props;
    const containerWidth = this.getContainerWidth();
    return (
      <div
        className={cx('c-search-input', className, {
          [variant]: SearchInput.VARIANTS.includes(variant),
          [`size-${size}`]: size
        })}
        data-test={`${testId}-search-input-container`}
      >
        <div
          ref={this.containerRef}
          className={cx('search-input-bar', { '-loading': isLoading, '-disabled': isDisabled })}
          onClick={this.focusInput}
          role="textbox"
        >
          <input
            {...getInputProps({
              placeholder: placeholderSmall,
              type: 'search',
              autoComplete: 'off',
              disabled: isDisabled,
              className: 'search-input-field show-for-small',
              'data-test': `${testId}-search-input-field-sm${isDisabled ? '-disabled' : ''}`
            })}
          />
          <input
            {...getInputProps({
              placeholder,
              type: 'search',
              autoComplete: 'off',
              disabled: isDisabled,
              className: 'search-input-field hide-for-small',
              'data-test': `${testId}-search-input-field-lg${isDisabled ? '-disabled' : ''}`
            })}
          />
          {isLoading ? (
            <ShrinkingSpinner className="-dark" />
          ) : (
            <svg className="icon icon-search">
              <use xlinkHref="#icon-search" />
            </svg>
          )}
        </div>
        {isOpen && items.length > 0 && (
          <FixedSizeList
            height={250}
            width={containerWidth}
            itemSize={42}
            itemData={items}
            itemCount={items.length}
            innerElementType="ul"
            className="search-input-results"
          >
            {({ index, style, data }) => {
              const item = data[index];
              return (
                <SearchInputResult
                  key={index}
                  item={item}
                  style={style}
                  className={resultClassName}
                  testId={getResultTestId(item)}
                  searchString={inputValue}
                  itemProps={getItemProps({ item })}
                  nodeTypeRenderer={nodeTypeRenderer}
                  isHighlighted={index === highlightedIndex}
                />
              );
            }}
          </FixedSizeList>
        )}
      </div>
    );
  };

  render() {
    const { searchOptions, onSelect, items } = this.props;
    return (
      <Downshift
        stateReducer={this.stateReducer}
        defaultHighlightedIndex={0}
        itemCount={items.length}
        onChange={node => node && onSelect(node, searchOptions)}
        itemToString={i => (i === null ? '' : i.name)}
        onInputValueChange={term => this.onInputValueChange(term, searchOptions)}
      >
        {this.renderSearchBox}
      </Downshift>
    );
  }
}

SearchInput.propTypes = {
  size: PropTypes.string,
  year: PropTypes.number,
  testId: PropTypes.string,
  variant: PropTypes.string,
  isLoading: PropTypes.bool,
  isDisabled: PropTypes.bool,
  className: PropTypes.string,
  placeholder: PropTypes.string,
  getResultTestId: PropTypes.func,
  nodeTypeRenderer: PropTypes.func,
  items: PropTypes.array,
  resultClassName: PropTypes.string,
  placeholderSmall: PropTypes.string,
  searchOptions: PropTypes.object,
  onSelect: PropTypes.func.isRequired,
  onSearchTermChange: PropTypes.func.isRequired
};

SearchInput.defaultProps = {
  placeholder: 'search',
  placeholderSmall: 'search',
  items: [],
  getResultTestId: item => `search-result-${item.name}`
};

export default SearchInput;
