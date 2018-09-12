import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import HighlightTextFragments from 'react-components/shared/highlight-text-fragments.component';

function SearchInputResult({ className, item, itemProps, searchString, isHighlighted, testId }) {
  return (
    <li
      {...itemProps}
      className={cx('c-search-input-result', className, { '-highlighted': isHighlighted })}
      data-test={testId}
    >
      <span className="search-input-item-type">{item.nodeType}</span>
      <span className="search-input-item-name">
        <HighlightTextFragments text={item.name} highlight={searchString} />
      </span>
    </li>
  );
}

SearchInputResult.propTypes = {
  testId: PropTypes.string,
  className: PropTypes.string,
  item: PropTypes.object.isRequired,
  itemProps: PropTypes.object.isRequired,
  searchString: PropTypes.string.isRequired,
  isHighlighted: PropTypes.bool.isRequired
};

export default SearchInputResult;
