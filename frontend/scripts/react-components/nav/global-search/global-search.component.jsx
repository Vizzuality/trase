/* eslint-disable jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Downshift from 'downshift';
import debounce from 'lodash/debounce';
import isEmpty from 'lodash/isEmpty';
import kebabCase from 'lodash/kebabCase';
import GlobalSearchResult from 'react-components/nav/global-search/global-search-result/global-search-result.component';
import { MAX_SEARCH_RESULTS } from 'constants';

import 'react-components/nav/global-search/global-search.scss';
import 'react-components/nav/global-search/global-search-result/global-search-result.scss';

const SEARCH_DEBOUNCE_RATE_IN_MS = 400;

export default class GlobalSearch extends Component {
  constructor(props) {
    super(props);
    this.state = { isSearchOpen: false, inputValue: '' };
    this.onOpenClicked = this.onOpenClicked.bind(this);
    this.onCloseClicked = this.onCloseClicked.bind(this);
    this.onKeydown = this.onKeydown.bind(this);
    this.onDownshiftStateChange = this.onDownshiftStateChange.bind(this);
    this.onItemSelected = this.onItemSelected.bind(this);
    this.debouncedInputValueChange = debounce(
      this.debouncedInputValueChange.bind(this),
      SEARCH_DEBOUNCE_RATE_IN_MS
    );
    this.onInputValueChange = this.onInputValueChange.bind(this);
    this.setDownshiftRef = element => {
      this.downshift = element;
    };
    this.setInputRef = element => {
      this.input = element;
    };

    document.addEventListener('keydown', this.onKeydown);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.input && !prevState.isSearchOpen && this.state.isSearchOpen) {
      this.input.focus();
    }
  }

  componentWillUnmount() {
    // reset search term when removing this component
    this.debouncedInputValueChange('');
    document.removeEventListener('keydown', this.onKeydown);
  }

  onOpenClicked(e) {
    if (e) e.stopPropagation();
    this.setState({ isSearchOpen: true });
  }

  onCloseClicked(e) {
    if (e) e.stopPropagation();
    this.setState({ isSearchOpen: false, inputValue: '' });
    this.debouncedInputValueChange('');
  }

  onItemSelected(item) {
    this.onCloseClicked();
    this.props.onItemSelected(item);
  }

  onDownshiftStateChange(state) {
    if (state.inputValue !== undefined) this.onInputValueChange(state.inputValue);
  }

  onInputValueChange(value) {
    this.setState({ inputValue: value });
    this.debouncedInputValueChange(value);
  }

  onKeydown(e) {
    if (e.key === 'Escape' && this.state.isSearchOpen) {
      this.onCloseClicked();
    }
  }

  debouncedInputValueChange(value) {
    this.props.onInputValueChange(value);
  }

  render() {
    const { isLoading, className, searchResults = [], searchTerm } = this.props;
    const { isSearchOpen, inputValue } = this.state;
    const noResults = !searchResults.length && !isLoading && !isEmpty(searchTerm);

    if (!isSearchOpen) {
      return (
        <div onClick={this.onOpenClicked} className={className} data-test="global-search-toggle">
          <svg className="icon icon-search">
            <use xlinkHref="#icon-search" />
          </svg>
        </div>
      );
    }

    return (
      <div className="c-search -global">
        {isLoading ? (
          <span className="search-spinner" />
        ) : (
          <svg className="icon icon-search">
            <use xlinkHref="#icon-search" />
          </svg>
        )}
        <div className="c-search__veil" onClick={this.onCloseClicked} />
        <div className="search-wrapper">
          <Downshift
            itemToString={i => {
              if (i === null) return '';
              if (typeof i === 'object') return i.name;
              return i;
            }}
            selectedItem={inputValue}
            onStateChange={this.onDownshiftStateChange}
            onChange={this.onItemSelected}
            ref={this.setDownshiftRef}
          >
            {({ getInputProps, getItemProps, highlightedIndex }) => (
              <div className="search-container" onClick={e => e.stopPropagation()}>
                <div className="search-bar">
                  <input
                    {...getInputProps({
                      placeholder: 'Search a producer, trader or country of import'
                    })}
                    ref={this.setInputRef}
                    className="search-bar-input"
                    type="search"
                    data-test="global-search-input"
                  />
                </div>
                {!isEmpty(searchTerm) && (
                  <ul className="search-results">
                    {searchResults.slice(0, MAX_SEARCH_RESULTS).map((item, row) => (
                      <GlobalSearchResult
                        key={row}
                        value={searchTerm}
                        isLoading={isLoading}
                        isHighlighted={row === highlightedIndex}
                        item={item}
                        itemProps={getItemProps({ item })}
                        testId={`global-search-result-${kebabCase(item.name)}-${
                          item.contextId
                        }`.toLowerCase()}
                      />
                    ))}
                    {noResults && (
                      <li className="c-search-result -no-highlight">
                        <div className="search-node-text-container">
                          <span className="search-node-name" data-test="global-search-no-result">
                            No results found
                          </span>
                        </div>
                      </li>
                    )}
                  </ul>
                )}
              </div>
            )}
          </Downshift>
        </div>
      </div>
    );
  }
}

GlobalSearch.propTypes = {
  className: PropTypes.string,
  isLoading: PropTypes.bool,
  onInputValueChange: PropTypes.func,
  onItemSelected: PropTypes.func,
  searchResults: PropTypes.array,
  searchTerm: PropTypes.string
};
