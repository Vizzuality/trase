import React, { Component } from 'react';
import { findAll } from 'highlight-words-core';
import cx from 'classnames';
import PropTypes from 'prop-types';

export default class ToolSearchResult extends Component {
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
    const {
      value,
      onClickNavigate,
      onClickAdd,
      selected,
      itemProps,
      isHighlighted,
      item
    } = this.props;
    const nameSegments = ToolSearchResult.getNameSegments(value, item.name);

    return (
      <li {...itemProps} className={cx('c-tool-search-result', { '-highlighted': isHighlighted })}>
        <div className="tool-search-node-text-container">
          <span className="tool-search-node-type">{item.type}</span>
          <span className="tool-search-node-name">{nameSegments}</span>
        </div>
        <div className="tool-search-node-actions-container">
          <button
            onClick={e => onClickAdd(e, item)}
            className="c-button -medium-large"
            disabled={selected}
          >
            {selected ? 'Already in' : 'Add to'} supply chain
          </button>
          {item.profileType &&
            item.type.split(' & ').map(type => (
              <button
                key={item.name + type}
                role="link"
                className="c-button -medium-large"
                onClick={e => onClickNavigate(e, item, type)}
              >
                See {type} profile
              </button>
            ))}
        </div>
      </li>
    );
  }
}

ToolSearchResult.propTypes = {
  value: PropTypes.string,
  onClickNavigate: PropTypes.func,
  onClickAdd: PropTypes.func,
  selected: PropTypes.bool,
  itemProps: PropTypes.object,
  isHighlighted: PropTypes.bool,
  item: PropTypes.object
};
