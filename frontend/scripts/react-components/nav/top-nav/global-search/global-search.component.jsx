/* eslint-disable jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Downshift from 'downshift';
import SearchResult from 'react-components/nav/top-nav/global-search/global-search-result.component';
import 'styles/components/nav/global-search.scss';
import 'styles/components/nav/global-search-result.scss';

export default class GlobalSearch extends Component {
  constructor(props) {
    super(props);
    this.state = { isSearchOpen: false };
    this.onOpenClicked = this.onOpenClicked.bind(this);
    this.onCloseClicked = this.onCloseClicked.bind(this);
    this.onKeydown = this.onKeydown.bind(this);
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
    document.removeEventListener('keydown', this.onKeydown);
  }

  onOpenClicked(e) {
    if (e) e.stopPropagation();
    this.setState({ isSearchOpen: true });
  }

  onCloseClicked(e) {
    if (e) e.stopPropagation();
    this.setState({ isSearchOpen: false });
  }

  onKeydown(e) {
    if (e.key === 'Escape' && this.state.isSearchOpen) {
      this.onCloseClicked();
    }
  }

  render() {
    const { className, searchResults = [], onInputValueChange } = this.props;
    const { isSearchOpen } = this.state;

    if (!isSearchOpen) {
      return (
        <div onClick={this.onOpenClicked} className={className}>
          <svg className="icon icon-search">
            <use xlinkHref="#icon-search" />
          </svg>
        </div>
      );
    }

    return (
      <div className="c-search -global">
        <svg className="icon icon-search">
          <use xlinkHref="#icon-search" />
        </svg>
        <div className="c-search__veil" onClick={this.onCloseClicked} />
        <div className="search-wrapper">
          <Downshift
            itemToString={i => (i === null ? '' : i.name)}
            onSelect={this.onSelected}
            onInputValueChange={onInputValueChange}
            ref={this.setDownshiftRef}
          >
            {({ getInputProps, getItemProps, isOpen, inputValue, highlightedIndex }) => (
              <div className="search-container" onClick={e => e.stopPropagation()}>
                <div className="search-bar">
                  <input
                    {...getInputProps({
                      placeholder: 'Search a producer or trader'
                    })}
                    ref={this.setInputRef}
                    className="search-bar-input"
                    type="search"
                  />
                </div>
                {isOpen && (
                  <ul className="search-results">
                    {searchResults
                      .slice(0, 10)
                      .map((item, row) => (
                        <SearchResult
                          key={row}
                          value={inputValue}
                          isHighlighted={row === highlightedIndex}
                          item={item}
                          itemProps={getItemProps({ item })}
                        />
                      ))}
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
  searchResults: PropTypes.array,
  onInputValueChange: PropTypes.func
};
