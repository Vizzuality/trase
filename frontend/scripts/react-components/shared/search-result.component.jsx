import React, { Component } from 'react';
import { findAll } from 'highlight-words-core';
import cx from 'classnames';
import PropTypes from 'prop-types';

export default class SearchResult extends Component {
  static getNameSegments(value, name) {
    // get name segments for highlighting typed string
    // ie if you type 'ng', you get ['pi', 'ng', 'po', 'ng']
    return findAll({
      searchWords: [value],
      textToHighlight: name
    })
      .map((chunk) => {
        const segmentStr = name.substr(chunk.start, chunk.end - chunk.start);
        return (chunk.highlight) ? <mark >{segmentStr}</mark > : <span >{segmentStr}</span >;
      });
  }

  render() {
    const {
      value, onClickNavigate, onClickAdd, selected, itemProps, isHighlighted, item
    } = this.props;
    const nameSegments = SearchResult.getNameSegments(value, item.name);

    return (
      <div
        {...itemProps}
        className={cx('suggestion', { '-highlighted': isHighlighted })}
      >
        <div className="node-text-container" >
          <span className="node-type" >{item.type}</span >
          <span className="node-name" >
            {nameSegments}
          </span >
        </div >
        <div className="node-actions-container" >
          <button
            onClick={e => onClickAdd(e, item)}
            className="c-button -medium-large"
            disabled={selected}
          >
            {selected ? 'Already in' : 'Add to'} supply chain
          </button >
          {
            item.profileType && item.type.split(' & ')
              .map((type, key) => (
                <button
                  key={key}
                  role="link"
                  className="c-button -medium-large"
                  onClick={e => onClickNavigate(e, item, type)}
                >
                  See {type} profile
                </button >
              ))
          }
        </div >
      </div >
    );
  }
}

SearchResult.propTypes = {
  value: PropTypes.string,
  onClickNavigate: PropTypes.func,
  onClickAdd: PropTypes.func,
  selected: PropTypes.bool,
  itemProps: PropTypes.object,
  isHighlighted: PropTypes.bool,
  item: PropTypes.object
};
