/* eslint-disable react/no-danger */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

class ProfileSearchResult extends Component {
  getHighlightedString(highlight, string) {
    const s = highlight.replace(/[-\\^$*+?.()|[\]{}]/g, '\\$&');
    return `${string.replace(RegExp(s, 'gi'), '<mark>$&</mark>')}`;
  }

  render() {
    const { item, itemProps, searchString } = this.props;
    return (
      <li
        {...itemProps}
      >
        <span className="node-type" >{item.type}</span>
        <span
          className="node-name"
          dangerouslySetInnerHTML={{ __html: this.getHighlightedString(searchString, item.name) }}
        />
      </li>
    );
  }
}


ProfileSearchResult.propTypes = {
  itemProps: PropTypes.object.isRequired,
  item: PropTypes.object.isRequired,
  searchString: PropTypes.string.isRequired
};

export default ProfileSearchResult;
