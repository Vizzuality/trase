import { h, Component } from 'preact';
import { findAll } from 'highlight-words-core';
import cx from 'classnames';

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
        return (chunk.highlight) ? <mark>{segmentStr}</mark> : <span>{segmentStr}</span>;
      });
  }

  render(props) {
    const { value, onClickNavigate, onClickAdd, selected, itemProps, isHighlighted, item } = props;
    const nameSegments = SearchResult.getNameSegments(value, item.name);

    return (
      <div
        {...itemProps}
        class={cx('suggestion', { '-highlighted': isHighlighted })}
      >
        <div class='node-text-container'>
          <span class='node-type'>{item.type}</span>
          <span class='node-name'>
            {nameSegments}
          </span>
        </div>
        <div class='node-actions-container'>
          <button
            onClick={e => onClickAdd(e, item)}
            class='c-button -medium-large'
            disabled={selected}
          >
            {selected ? 'Already in' : 'Add to'} supply chain
          </button>
          {
            item.profileType && item.type.split(' & ')
              .map(type => (
                <button
                  role='link'
                  class='c-button -medium-large'
                  onClick={e => onClickNavigate(e, item, type)}
                >
                  See {type} profile
                </button>
              ))
          }
        </div>
      </div>
    );
  }
}