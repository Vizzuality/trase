import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Downshift from 'downshift';
import ProfileSearchResult from 'react-components/profile-root/profile-search-result.component';

class ProfileSearch extends Component {
  constructor(props) {
    super(props);

    this.renderSearchBox = this.renderSearchBox.bind(this);
    this.onResultSelected = this.onResultSelected.bind(this);
  }

  onResultSelected(selectedItem) {
    this.props.onNodeSelected(selectedItem);
  }

  renderSearchBox({ getInputProps, getItemProps, isOpen, inputValue, highlightedIndex }) {
    const visibleResults = this.props.nodes.filter(
      item => inputValue.length > 1 && item.name.toLowerCase().includes(inputValue.toLowerCase())
    );
    return (
      <div className="c-profile-search">
        <div className="profile-search-bar">
          <input
            {...getInputProps({ placeholder: 'Search a company or production place' })}
            type="search"
            className="profile-search-input"
          />
          <svg className="icon icon-search">
            <use xlinkHref="#icon-search" />
          </svg>
        </div>
        {isOpen &&
          visibleResults.length > 0 && (
            <ul className="profile-search-results">
              {visibleResults
                .slice(0, 10)
                .map((item, row) => (
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
