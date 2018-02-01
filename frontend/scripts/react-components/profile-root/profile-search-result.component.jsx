/* eslint-disable react/no-danger */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

class ProfileSearchResult extends Component {
  getHighlightedString(highlight, string) {
    const s = highlight.replace(/[-\\^$*+?.()|[\]{}]/g, '\\$&');
    return `${string.replace(RegExp(s, 'gi'), '<mark>$&</mark>')}`;
  }

  render() {
    const { item, itemProps, searchString, isHighlighted } = this.props;
    return (
      <li
        {...itemProps}
        className={cx('c-profile-search-result', { '-highlighted': isHighlighted })}
      >
        <span className="profile-search-node-type">{item.type}</span>
        <span
          className="profile-search-node-name"
          dangerouslySetInnerHTML={{ __html: this.getHighlightedString(searchString, item.name) }}
        />
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
