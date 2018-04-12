/* eslint-disable  jsx-a11y/interactive-supports-focus */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Downshift from 'downshift';
import ProfileSearchResult from 'react-components/profile-root/profile-search-result.component';
import cx from 'classnames';

/**
 * Dear future developer,
 * The implementation of this component is fairly similar to the one on the tool page,
 * however (after exhaustive analysis) we decided against reusing the components.
 * Why? We're using Downshift to implement the search, this already provides us with all basics and
 * some other extra goooood stuff. If we were to make a component for the 3 types of search in
 * this app, we would need to create a super generic wrapper on top of downshift and 3 specific
 * components and containers for the use case specific stuff. Yet another abstraction adding
 * complexity.
 *
 * Sometimes keeping it DRY means repeating yourself a little bit.
 */
class ProfileSearch extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      searchTerm: ''
    };
    this.renderSearchBox = this.renderSearchBox.bind(this);
    this.onResultSelected = this.onResultSelected.bind(this);
    this.onInputValueChange = this.onInputValueChange.bind(this);
  }

  onResultSelected(selectedItem) {
    this.props.onNodeSelected(selectedItem);
  }

  onInputValueChange(searchTerm) {
    this.setState({ searchTerm });
    if (searchTerm.length > 2) {
      this.props.onSearchTermChange(searchTerm);
    }
  }

  focusInput(e) {
    const input = e.currentTarget.querySelector('input');
    if (input) input.focus();
  }

  renderSearchBox({
    getInputProps,
    getItemProps,
    isOpen,
    inputValue,
    highlightedIndex,
    onInputValueChange
  }) {
    const loading = this.state.loading;
    const visibleResults = this.props.nodes
      .filter(
        item => inputValue.length > 1 && item.name.toLowerCase().includes(inputValue.toLowerCase())
      )
      .slice(0, 10);
    return (
      <div className="c-profile-search">
        <div
          className={cx('profile-search-bar', { '-loading': loading })}
          onClick={this.focusInput}
          role="textbox"
        >
          <input
            {...getInputProps({ placeholder: 'Search' })}
            type="search"
            className="profile-search-input show-for-small"
            disabled={loading}
            oncChange={onInputValueChange}
          />
          <input
            {...getInputProps({ placeholder: 'Search a company or production place' })}
            type="search"
            className="profile-search-input hide-for-small"
            disabled={loading}
          />
          {loading ? (
            <span className="profile-search-spinner" />
          ) : (
            <svg className="icon icon-search">
              <use xlinkHref="#icon-search" />
            </svg>
          )}
        </div>
        {isOpen &&
          visibleResults.length > 0 && (
            <ul className="profile-search-results">
              {visibleResults.map((item, row) => (
                <ProfileSearchResult
                  key={item.id}
                  item={item}
                  searchString={inputValue}
                  itemProps={getItemProps({ item })}
                  isHighlighted={row === highlightedIndex}
                />
              ))}
            </ul>
          )}
      </div>
    );
  }

  render() {
    return (
      <Downshift
        onSelect={this.onResultSelected}
        onChange={this.onChange}
        itemToString={i => (i === null ? '' : i.name)}
        onInputValueChange={this.onInputValueChange}
        inputValue={this.state.searchTerm}
      >
        {this.renderSearchBox}
      </Downshift>
    );
  }
}

ProfileSearch.propTypes = {
  nodes: PropTypes.array.isRequired,
  onNodeSelected: PropTypes.func.isRequired,
  onSearchTermChange: PropTypes.func.isRequired
};

export default ProfileSearch;
