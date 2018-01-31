import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Downshift from 'downshift';
import ProfileSearchResult from 'react-components/profile-root/profile-search-result.component';

class ProfileSearchBox extends Component {
  constructor(props) {
    super(props);

    this.renderSearchBox = this.renderSearchBox.bind(this);
    this.onResultSelected = this.onResultSelected.bind(this);
  }

  onResultSelected(selectedItem) {
    this.props.onNodeSelected(selectedItem);
  }

  renderSearchBox({ getInputProps, getItemProps, isOpen, inputValue }) {
    const visibleResults = this.props.nodes.filter(
      item => inputValue.length > 1 && item.name.toLowerCase().includes(inputValue.toLowerCase())
    );
    return (
      <div className="c-search">
        <label htmlFor="search-input">Search for</label>
        <input
          {...getInputProps({ placeholder: 'trader or production place' })}
          className="search-input"
          id="search-input"
        />
        {isOpen &&
          visibleResults.length > 1 && (
            <ul>
              {visibleResults
                .slice(0, 10)
                .map(item => (
                  <ProfileSearchResult
                    key={item.id}
                    item={item}
                    searchString={inputValue}
                    itemProps={getItemProps({ item })}
                  />
                ))}
            </ul>
          )}
        <svg className="icon icon-search">
          <use xlinkHref="#icon-search" />
        </svg>
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

ProfileSearchBox.propTypes = {
  nodes: PropTypes.array.isRequired,
  onNodeSelected: PropTypes.func.isRequired
};

export default ProfileSearchBox;
