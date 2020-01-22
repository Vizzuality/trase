import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import HighlightTextFragments from 'react-components/shared/highlight-text-fragments.component';

function SearchInputResult(props) {
  const {
    style,
    className,
    item,
    itemProps,
    searchString,
    isHighlighted,
    testId,
    nodeTypeRenderer
  } = props;
  return (
    <li
      {...itemProps}
      style={style}
      className={cx('c-search-input-result', className, { '-highlighted': isHighlighted })}
      data-test={testId}
    >
      <span className="search-input-item-type">{nodeTypeRenderer(item)}</span>
      <span className="search-input-item-name">
        <HighlightTextFragments text={item.name} highlight={searchString} />
      </span>
    </li>
  );
}

SearchInputResult.propTypes = {
  testId: PropTypes.string,
  className: PropTypes.string,
  nodeTypeRenderer: PropTypes.func,
  item: PropTypes.object.isRequired,
  style: PropTypes.object.isRequired,
  itemProps: PropTypes.object.isRequired,
  isHighlighted: PropTypes.bool.isRequired,
  searchString: PropTypes.string.isRequired
};

SearchInputResult.defaultProps = {
  nodeTypeRenderer: node => node.nodeType
};

export default SearchInputResult;
