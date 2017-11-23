import { h, Component } from 'preact';
import 'styles/components/shared/search.scss';
import 'styles/components/shared/autocomplete.scss';
import Downshift from 'downshift/preact';
import { findAll } from 'highlight-words-core';
import cx from 'classnames';

export default class Search extends Component {
  constructor() {
    super();
    this.state = {
      isOpened: true
    };
    this.onOpenClicked = this.onOpenClicked.bind(this);
    this.onCloseClicked = this.onCloseClicked.bind(this);
    this.onSelected = this.onSelected.bind(this);
  }

  onOpenClicked(e) {
    if (e) e.stopPropagation();
    this.setState({
      isOpened: true
    });
  }

  onCloseClicked(e) {
    if (e) e.stopPropagation();
    this.setState({
      isOpened: false
    });
  }

  onSelected(selectedItem) {
    // TODO: implement dual selection, for now just displays importer
    const parts = selectedItem.id.split('_');
    const id = parts.length > 1 ? parseInt(parts[0]) : selectedItem.id;
    this.props.onNodeSelected(id);
    this.onCloseClicked();
  }

  render({ nodes = [] }) {
    if (this.state.isOpened === false) {
      return <div onClick={this.onOpenClicked} class='nav-item'>
        <svg class='icon icon-search'><use xlinkHref='#icon-search' /></svg>
      </div>;
    }

    return <div class='c-search'>
      <svg class='icon icon-search'><use xlinkHref='#icon-search' /></svg>
      <div class='c-search__veil' onClick={this.onCloseClicked} />
      <div class='autocomplete'>
        <Downshift
          itemToString={i => (i === null ? '' : i.name)}
          onSelect={this.onSelected}
        >
          {({
            getInputProps,
            getItemProps,
            isOpen,
            inputValue,
            highlightedIndex
          }) => {
            // stopPropagation is called to avoid calling onOpenClicked.
            return <div onClick={e => e.stopPropagation()}>
              <input {...getInputProps({ placeholder: 'Search a producer, trader or country of import' })} />
              {isOpen ? (
                <div class='suggestions'>
                  {nodes
                    .filter(
                      i =>
                        !inputValue ||
                        i.name.toLowerCase().includes(inputValue.toLowerCase()),
                    )
                    .slice(0, 10)
                    .map((item, row) => {
                      // get name segments for highlighting typed string
                      // ie if you type 'ng', you get ['pi', 'ng', 'po', 'ng']
                      const nameSegments = findAll({
                        searchWords: [inputValue],
                        textToHighlight: item.name
                      }).map((chunk) => {
                        const segmentStr = item.name.substr(chunk.start, chunk.end - chunk.start);
                        return (chunk.highlight) ? <mark>{segmentStr}</mark> : <span>{segmentStr}</span>;
                      });
                      return (
                        <div
                          {...getItemProps({ item })}
                          key={item.id}
                          class={cx('suggestion', { '-highlighted': row === highlightedIndex })}
                        >
                          <div class='node-text-container'>
                            <span class='node-type'>{item.type}</span>
                            <span class='node-name'>
                              {nameSegments}
                            </span>
                          </div>
                          <div class='node-actions-container'>
                            <button class='c-button -charcoal -medium-large'>Add to supply chain</button>
                            {item.type !== 'EXPORTER' && item.type !== 'MUNICIPALITY' &&
                              <button class='c-button -transparent-dark -medium-large'>See importer profile</button>
                            }
                            {item.type !== 'IMPORTER' && item.type !== 'MUNICIPALITY' &&
                              <button class='c-button -transparent-dark -medium-large'>See exporter profile</button>
                            }
                          </div>
                        </div>
                      );
                    })}
                </div>
              ) : null}
            </div>;
          }}
        </Downshift>
      </div>
    </div>;
  }
}
