import { h, Component } from 'preact';
import 'styles/components/shared/search.scss';
import 'styles/components/shared/autocomplete.scss';
import Downshift from 'downshift/preact';
import { findAll } from 'highlight-words-core';

export default class Search extends Component {
  constructor() {
    super();
    this.state = {
      isOpened: true
    };
  }

  onOpenClicked() {
    this.setState({
      isOpened: true
    });
  }

  onCloseClicked() {
    this.setState({
      isOpened: false
    });
  }

  onSelected(selectedItem) {
    this.props.onNodeSelected(selectedItem.id);
    this.onCloseClicked();
  }

  render({ nodes }) {
    if (this.state.isOpened === false) {
      return <div onClick={(e) => { console.log(e.target); this.onOpenClicked(); }} class='nav-item'>
        <svg class='icon icon-search'><use xlinkHref='#icon-search' /></svg>
      </div>;
    }

    return <div class='c-search'>
      <svg class='icon icon-search'><use xlinkHref='#icon-search' /></svg>
      <div class='c-search__veil' onClick={(e) => { console.log(e.target); this.onCloseClicked(); }} />
      <div class='autocomplete'>
        <Downshift
          itemToString={i => (i == null ? '' : i.name)}
          onSelect={(selectedItem) => { this.onSelected(selectedItem); }}
        >
          {({
            getInputProps,
            getItemProps,
            isOpen,
            inputValue
          }) => {
            return <div>
              <input {...getInputProps({ placeholder: 'Search a producer, trader or country of import' })} />
              {isOpen ? (
                <div class='suggestions'>
                  {nodes
                    .filter(
                      i =>
                        !inputValue ||
                        i.name.toLowerCase().includes(inputValue.toLowerCase()),
                    )
                    .splice(0, 10)
                    .map((item) => {
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
                          class='suggestion'
                        >
                          <span class='node-type'>{item.type}</span>
                          <span class='node-name'>
                            {nameSegments}
                          </span>

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
