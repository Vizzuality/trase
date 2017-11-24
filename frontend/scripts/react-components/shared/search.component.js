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
      isOpened: false
    };
    this.onOpenClicked = this.onOpenClicked.bind(this);
    this.onCloseClicked = this.onCloseClicked.bind(this);
    this.onSelected = this.onSelected.bind(this);
    this.onKeydown = this.onKeydown.bind(this);
    this.getInputRef = this.getInputRef.bind(this);
    document.addEventListener('keydown', this.onKeydown);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.onKeydown);
  }

  getInputRef(el) {
    this.input = el;
  }

  onOpenClicked(e) {
    if (e) e.stopPropagation();
    this.setState({
      isOpened: true
    }, () => ((this.input && !this.input.focused) && this.input.focus()));
  }

  onCloseClicked(e) {
    if (e) e.stopPropagation();
    this.setState({
      isOpened: false
    });
  }

  onSelected(selectedItem) {
    // TODO: implement dual selection, for now just displays importer
    const parts = (selectedItem.id + '').split('_');
    const id = parts.length > 1 ? parseInt(parts[0]) : selectedItem.id;
    this.props.onNodeSelected(id);
    this.onCloseClicked();
  }

  onKeydown(e) {
    e.stopPropagation();
    const isValidChar = (/^([a-z]|[A-Z]|ñ|Ñ|á|é|í|ó|ú|Á|É|Í|Ó|Ú){1}$/.test(e.key));
    if (!this.state.isOpened && isValidChar) {
      this.onOpenClicked();
    }
    if (e.key === 'Escape' && this.state.isOpened) {
      this.onCloseClicked();
    }
  }

  navigateToActor(e, item, type) {
    if (e) e.stopPropagation();
    const node = item[type.toLowerCase()] || item;
    window.location = `profile-${node.profileType}.html?nodeId=${node.id}`;
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
              <input
                {...getInputProps({ placeholder: 'Search a producer, trader or country of import' })}
                ref={this.getInputRef}
              />
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
                            <button
                              onClick={() => this.onSelected(item)}
                              class='c-button -medium-large'
                            >
                              Add to supply chain
                            </button>
                            {
                              item.type.split(' & ')
                                .map(type => (
                                  <button
                                    role='link'
                                    class='c-button -medium-large'
                                    onClick={e => this.navigateToActor(e, item, type)}
                                  >
                                    See {type} profile
                                  </button>
                                ))
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
