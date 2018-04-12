import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import camelcase from 'lodash/camelCase';
import Link from 'redux-first-router-link';

import HighlightTextFragments from 'react-components/shared/highlight-text-fragments.component';

function GlobalSearchResult({ value, itemProps, isHighlighted, item }) {
  return (
    <li {...itemProps} className={cx('c-search-result', { '-highlighted': isHighlighted })}>
      <div className="search-node-text-container">
        <span className="search-node-type">{item.type}</span>
        <span className="search-node-name">
          <HighlightTextFragments text={item.name} highlight={value} />
        </span>
      </div>
      <div className="search-node-actions-container">
        <Link className="c-button -medium-large" to={{ type: 'tool' }}>
          Supply Chain
        </Link>
        <Link
          className="c-button -medium-large"
          to={{ type: 'tool', payload: { query: { state: { isMapVisible: true } } } }}
        >
          Production Region
        </Link>

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

GlobalSearchResult.propTypes = {
  value: PropTypes.string,
  itemProps: PropTypes.object,
  isHighlighted: PropTypes.bool,
  item: PropTypes.object
};

export default GlobalSearchResult;
