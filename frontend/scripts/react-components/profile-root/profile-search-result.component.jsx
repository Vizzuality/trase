import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import HighlightTextFragments from 'react-components/shared/highlight-text-fragments.component';

function ProfileSearchResult({ item, itemProps, searchString, isHighlighted }) {
  return (
    <li {...itemProps} className={cx('c-profile-search-result', { '-highlighted': isHighlighted })}>
      <span className="profile-search-node-type">{item.nodeType}</span>
      <span className="profile-search-node-name">
        <HighlightTextFragments text={item.name} highlight={searchString} />
      </span>
    </li>
  );
}

ProfileSearchResult.propTypes = {
  itemProps: PropTypes.object.isRequired,
  item: PropTypes.object.isRequired,
  searchString: PropTypes.string.isRequired,
  isHighlighted: PropTypes.bool.isRequired
};

export default ProfileSearchResult;
