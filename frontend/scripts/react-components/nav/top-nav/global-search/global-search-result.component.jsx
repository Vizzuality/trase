import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { findAll } from 'highlight-words-core';
import cx from 'classnames';
import camelcase from 'lodash/camelCase';
import Link from 'redux-first-router-link';

export default class GlobalSearchResult extends Component {
  static getNameSegments(value, name) {
    // get name segments for highlighting typed string
    // ie if you type 'ng', you get ['pi', 'ng', 'po', 'ng']
    return findAll({
      searchWords: [value],
      textToHighlight: name
    }).map(chunk => {
      const segmentStr = name.substr(chunk.start, chunk.end - chunk.start);
      return chunk.highlight ? (
        <mark key={`marked_${segmentStr}_${name}_${chunk.start}`}>{segmentStr}</mark>
      ) : (
        <span key={`clean${segmentStr}_${name}_${chunk.start}`}>{segmentStr}</span>
      );
    });
  }

  render() {
    const { value, itemProps, isHighlighted, item } = this.props;
    const nameSegments = GlobalSearchResult.getNameSegments(value, item.name);

    return (
      <li {...itemProps} className={cx('c-search-result', { '-highlighted': isHighlighted })}>
        <div className="search-node-text-container">
          <span className="search-node-type">{item.type}</span>
          <span className="search-node-name">{nameSegments}</span>
        </div>
        <div className="search-node-actions-container">
          <Link exact strict className="c-button -medium-large" to={{ type: 'tool' }}>
            Supply Chain
          </Link>
          <Link
            exact
            strict
            className="c-button -medium-large"
            to={{ type: 'tool', query: { state: { isMapVisible: true } } }}
          >
            Production Region
          </Link>

          {item.profileType &&
            item.type.split(' & ').map(type => (
              <Link
                key={item.name + type}
                className="c-button -medium-large"
                exact
                strict
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
}

GlobalSearchResult.propTypes = {
  value: PropTypes.string,
  itemProps: PropTypes.object,
  isHighlighted: PropTypes.bool,
  item: PropTypes.object
};
