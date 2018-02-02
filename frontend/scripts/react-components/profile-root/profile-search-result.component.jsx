import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { findAll } from 'highlight-words-core';

class ProfileSearchResult extends Component {
  static getNameSegments(value, name) {
    // get name segments for highlighting typed string
    // ie if you type 'ng', you get ['pi', 'ng', 'po', 'ng']
    return findAll({
      searchWords: [value],
      textToHighlight: name
    }).map((chunk) => {
      const segmentStr = name.substr(chunk.start, chunk.end - chunk.start);
      return chunk.highlight ? (
        <mark key={`marked_${segmentStr}_${name}_${chunk.start}`}>{segmentStr}</mark>
      ) : (
        <span key={`clean${segmentStr}_${name}_${chunk.start}`}>{segmentStr}</span>
      );
    });
  }

  render() {
    const { item, itemProps, searchString, isHighlighted } = this.props;
    return (
      <li
        {...itemProps}
        className={cx('c-profile-search-result', { '-highlighted': isHighlighted })}
      >
        <span className="profile-search-node-type">{item.type}</span>
        <span className="profile-search-node-name">
          {ProfileSearchResult.getNameSegments(searchString, item.name)}
        </span>
      </li>
    );
  }
}

ProfileSearchResult.propTypes = {
  itemProps: PropTypes.object.isRequired,
  item: PropTypes.object.isRequired,
  searchString: PropTypes.string.isRequired,
  isHighlighted: PropTypes.bool.isRequired
};

export default ProfileSearchResult;
