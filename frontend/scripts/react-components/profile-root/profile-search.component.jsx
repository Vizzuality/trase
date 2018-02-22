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

    this.renderSearchBox = this.renderSearchBox.bind(this);
    this.onResultSelected = this.onResultSelected.bind(this);
  }

  onResultSelected(selectedItem) {
    this.props.onNodeSelected(selectedItem);
  }

  focusInput(e) {
    const input = e.currentTarget.querySelector('input');
    if (input) input.focus();
  }

  renderSearchBox({ getInputProps, getItemProps, isOpen, inputValue, highlightedIndex }) {
    const loading = this.props.nodes.length === 0;
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
            {...getInputProps({ placeholder: 'Search a company or production place' })}
            type="search"
            className="profile-search-input"
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
      >
        {this.renderSearchBox}
      </Downshift>
    );
  }
}

ProfileSearch.propTypes = {
  nodes: PropTypes.array.isRequired,
  onNodeSelected: PropTypes.func.isRequired
};

export default ProfileSearch;
