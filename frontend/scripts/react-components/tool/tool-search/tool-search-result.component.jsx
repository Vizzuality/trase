import React from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import camelcase from 'lodash/camelCase';
import Link from 'redux-first-router-link';

import HighlightTextFragments from 'react-components/shared/highlight-text-fragments.component';

function ToolSearchResult({ value, onClickAdd, selected, itemProps, isHighlighted, item }) {
  return (
    <li {...itemProps} className={cx('c-search-result', { '-highlighted': isHighlighted })}>
      <div className="search-node-text-container">
        <span className="search-node-type">{item.type}</span>
        <span className="search-node-name">
          <HighlightTextFragments text={item.name} highlight={value} />
        </span>
      </div>
      <div className="search-node-actions-container">
        <button
          onClick={e => onClickAdd(e, item)}
          className="c-button -medium-large"
          disabled={selected}
        >
          {selected ? 'Already in' : 'Add to'} supply chain
        </button>
        {item.profileType &&
          item.type.split(' & ').map(type => (
            <Link
              key={item.name + type}
              className="c-button -medium-large"
              to={{
                type: camelcase(`profile-${item.profileType}`),
                query: { nodeId: item.id }
              }}
            >
              See {type} profile
            </Link>
          ))}
      </div>
    </li>
  );
}

ToolSearchResult.propTypes = {
  value: PropTypes.string,
  onClickAdd: PropTypes.func,
  selected: PropTypes.bool,
  itemProps: PropTypes.object,
  isHighlighted: PropTypes.bool,
  item: PropTypes.object
};

export default ToolSearchResult;
