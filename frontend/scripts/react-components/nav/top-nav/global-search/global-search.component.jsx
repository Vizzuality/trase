/* eslint-disable jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Downshift from 'downshift';
import deburr from 'lodash/deburr';
import SearchResult from 'react-components/nav/top-nav/global-search/global-search-result.component';
import 'styles/components/nav/global-search.scss';
import 'styles/components/nav/global-search-result.scss';

export default class GlobalSearch extends Component {
  static isValidChar(key) {
    const deburredKey = deburr(key);
    return /^([a-z]|[A-Z]){1}$/.test(deburredKey);
  }

  constructor(props) {
    super(props);
    this.state = {
      specialCharPressed: false,
      isSearchOpen: false
    };
    this.onOpenClicked = this.onOpenClicked.bind(this);
    this.onCloseClicked = this.onCloseClicked.bind(this);
    this.onKeydown = this.onKeydown.bind(this);
    this.onKeyup = this.onKeyup.bind(this);
    this.getDownshiftRef = this.getDownshiftRef.bind(this);
    this.getInputRef = this.getInputRef.bind(this);

    document.addEventListener('keydown', this.onKeydown);
    document.addEventListener('keyup', this.onKeyup);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.input && !prevState.isSearchOpen && this.state.isSearchOpen) {
      this.input.focus();
    }
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.onKeydown);
    document.removeEventListener('keyup', this.onKeyup);
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
    const { specialCharPressed, isSearchOpen } = this.state;

    if (!isSearchOpen && GlobalSearch.isValidChar(e.key) && !specialCharPressed) {
      this.onOpenClicked();
    } else if (e.key === 'Escape') {
      this.onCloseClicked();
    } else {
      this.setState(state => ({ specialCharPressed: state.specialCharPressed + 1 }));
    }
  }

  onKeyup(e) {
    if (!GlobalSearch.isValidChar(e.key)) {
      this.setState(state => ({ specialCharPressed: state.specialCharPressed - 1 }));
    }
  }

  getDownshiftRef(instance) {
    this.downshift = instance;
  }

  getInputRef(el) {
    this.input = el;
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
            ref={this.getDownshiftRef}
          >
            {({ getInputProps, getItemProps, isOpen, inputValue, highlightedIndex }) => (
              <div className="search-container" onClick={e => e.stopPropagation()}>
                <div className="search-bar">
                  <input
                    {...getInputProps({
                      placeholder: 'Search a producer or trader'
                    })}
                    ref={this.getInputRef}
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
                          key={item.id + item.type}
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
