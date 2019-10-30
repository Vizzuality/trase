/* eslint-disable  jsx-a11y/interactive-supports-focus */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Downshift from 'downshift';
import SearchInputResult from 'react-components/shared/search-input/search-input-result.component';
import cx from 'classnames';
import debounce from 'lodash/debounce';
import ShrinkingSpinner from 'react-components/shared/shrinking-spinner/shrinking-spinner.component';
import { MAX_SEARCH_RESULTS } from 'constants';

import 'scripts/react-components/shared/search-input/search-input.scss';

const SEARCH_DEBOUNCE_RATE_IN_MS = 400;

class SearchInput extends PureComponent {
  static VARIANTS = ['bordered', 'slim'];

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
    const visibleResults = items.slice(0, MAX_SEARCH_RESULTS);

    return (
      <div
        className={cx('c-search-input', className, {
          [variant]: SearchInput.VARIANTS.includes(variant),
          [`size-${size}`]: size
        })}
        data-test={`${testId}-search-input-container`}
      >
        <div
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
        {isOpen && visibleResults.length > 0 && (
          <ul className="search-input-results">
            {visibleResults.map((item, row) => (
              <SearchInputResult
                key={item.id}
                item={item}
                className={resultClassName}
                testId={getResultTestId(item)}
                searchString={inputValue}
                itemProps={getItemProps({ item })}
                nodeTypeRenderer={nodeTypeRenderer}
                isHighlighted={row === highlightedIndex}
              />
            ))}
          </ul>
        )}
      </div>
    );
  };

  render() {
    const { searchOptions, onSelect } = this.props;
    return (
      <Downshift
        stateReducer={this.stateReducer}
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
