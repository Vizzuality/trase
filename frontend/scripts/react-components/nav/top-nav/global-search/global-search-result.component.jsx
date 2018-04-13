import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import camelcase from 'lodash/camelCase';

import LinkButton from 'react-components/shared/link-button.component';
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
        <LinkButton to={{ type: 'tool' }}>Supply Chain</LinkButton>
        <LinkButton to={{ type: 'tool', payload: { query: { state: { isMapVisible: true } } } }}>
          Production Region
        </LinkButton>

        {item.profileType &&
          item.type.split(' & ').map(type => (
            <LinkButton
              key={item.name + type}
              to={{
                type: camelcase(`profile-${item.profileType}`),
                query: { nodeId: item.id }
              }}
            >
              See {type} profile
            </LinkButton>
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
