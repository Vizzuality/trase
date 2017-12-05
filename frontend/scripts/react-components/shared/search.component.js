import { h, Component } from 'preact';
import 'styles/components/shared/search.scss';
import 'styles/components/shared/autocomplete.scss';
import Downshift from 'downshift/preact';
import { findAll } from 'highlight-words-core';
import cx from 'classnames';
import deburr from 'lodash/deburr';

import { PROFILE_PAGES_WHITELIST } from 'constants';

import NodeTitleGroup from 'containers/shared/node-title-group-react.container';

export default class Search extends Component {

  static getNodeId(selectedItem) {
    // TODO: implement dual selection, for now just displays importer
    const parts = (selectedItem.id + '').split('_');
    return parts.length > 1 ? parseInt(parts[0]) : selectedItem.id;
  }

  static isValidChar(key) {
    const deburredKey = deburr(key);
    return (/^([a-z]|[A-Z]){1}$/.test(deburredKey));
  }

  constructor() {
    super();
    this.state = {
      isOpened: false,
      specialCharPressed: false
    };
    this.onOpenClicked = this.onOpenClicked.bind(this);
    this.onCloseClicked = this.onCloseClicked.bind(this);
    this.onSelected = this.onSelected.bind(this);
    this.onAddNode = this.onAddNode.bind(this);
    this.onKeydown = this.onKeydown.bind(this);
    this.onKeyup = this.onKeyup.bind(this);
    this.getDownshiftRef = this.getDownshiftRef.bind(this);
    this.getInputRef = this.getInputRef.bind(this);
    this.isNodeSelected = this.isNodeSelected.bind(this);
    document.addEventListener('keydown', this.onKeydown);
    document.addEventListener('keyup', this.onKeyup);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.onKeydown);
    document.removeEventListener('keyup', this.onKeyup);
  }

  getDownshiftRef(instance) {
    this.downshift = instance;
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
    if (this.isNodeSelected(selectedItem)) return this.downshift.clearSelection();
    const id = Search.getNodeId(selectedItem);
    if (selectedItem.selected) {
      this.props.onRemoveNode(id);
    } else {
      this.props.onAddNode(id);
    }
    this.onCloseClicked();
  }

  onAddNode(e, selectedItem) {
    if (e) e.stopPropagation();
    const id = Search.getNodeId(selectedItem);
    this.props.onAddNode(id);
    this.downshift.reset();
    this.input.focus();
  }

  onKeydown(e) {
    const { specialCharPressed, isOpened } = this.state;
    if (!isOpened && Search.isValidChar(e.key) && !specialCharPressed) {
      this.onOpenClicked();
    } else if (e.key === 'Escape' && isOpened) {
      this.onCloseClicked();
    } else {
      this.setState({ specialCharPressed: true });
    }
  }

  onKeyup(e) {
    if (!Search.isValidChar(e.key)) {
      this.setState({ specialCharPressed: false });
    }
  }

  isNodeSelected(node) {
    return [node, node.exporter, node.importer]
      .filter(n => !!n)
      .map(n => n.id)
      .reduce((acc, next) => {
        return acc || this.props.selectedNodesIds.includes(next);
      }, false);
  }

  navigateToActor(e, item, type) {
    if (e) e.stopPropagation();
    const node = item[type.toLowerCase()] || item;
    window.location = `profile-${node.profileType}.html?nodeId=${node.id}`;
  }

  render({ nodes = [], selectedNodesIds = [] }) {
    if (this.state.isOpened === false) {
      return <div onClick={this.onOpenClicked} class='nav-item'>
        <svg class='icon icon-search'><use xlinkHref='#icon-search' /></svg>
      </div>;
    }

    return (<div class='c-search'>
      <svg class='icon icon-search'><use xlinkHref='#icon-search' /></svg>
      <div class='c-search__veil' onClick={this.onCloseClicked} />
      <div class='autocomplete'>
        <Downshift
          itemToString={i => (i === null ? '' : i.name)}
          onSelect={this.onSelected}
          ref={this.getDownshiftRef}
        >
          {({
            getInputProps,
            getItemProps,
            isOpen,
            inputValue,
            highlightedIndex
          }) => {
            // stopPropagation is called to avoid calling onOpenClicked.
            return <div class='autocomplete-container' onClick={e => e.stopPropagation()}>
              <div class='autocomplete-bar'>
                <div
                  style={selectedNodesIds.length > 3 && { overflow: 'auto' }}
                >
                  <NodeTitleGroup />
                </div>
                <input
                  {...getInputProps({ placeholder: 'Search a producer, trader or country of import' })}
                  ref={this.getInputRef}
                />
              </div>
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
                      const itemSelected = this.isNodeSelected(item);
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
                              onClick={e => this.onAddNode(e, item)}
                              class='c-button -medium-large'
                              disabled={itemSelected}
                            >
                              {itemSelected ? 'Already in' : 'Add to'} supply chain
                            </button>
                            {
                              PROFILE_PAGES_WHITELIST.includes(item.type) && item.type.split(' & ')
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
    </div>);
  }
}
