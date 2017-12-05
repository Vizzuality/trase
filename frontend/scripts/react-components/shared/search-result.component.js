import { h, Component } from 'preact';
import { findAll } from 'highlight-words-core';
import cx from 'classnames';
import { PROFILE_PAGES_WHITELIST } from 'constants';

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
            item.type.split(' & ')
              .map(type => PROFILE_PAGES_WHITELIST.includes(type) && (
                <button
                  role='link'
                  class='c-button -medium-large'
                  onClick={e => onClickNavigate(e, item, type)}
                >
                  See {type} profile
                </button>
              )).filter(b => !!b)
          }
        </div>
      </div>
    );
  }
}