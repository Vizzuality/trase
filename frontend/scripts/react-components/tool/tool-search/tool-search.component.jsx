/* eslint-disable jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Downshift from 'downshift';
import deburr from 'lodash/deburr';
import NodeTitleGroup from 'react-components/tool/tool-search/node-title-group.container';
import SearchResult from 'react-components/tool/tool-search/tool-search-result.component';
import 'styles/components/tool/tool-search.scss';
import 'styles/components/tool/tool-search-result.scss';

export default class ToolSearch extends Component {
  static getNodeIds(selectedItem) {
    const parts = `${selectedItem.id}`.split('_');
    if (parts.length > 1) {
      return [parseInt(parts[0], 10), parseInt(parts[1], 10)];
    }
    return [selectedItem.id];
  }

  static isValidChar(key) {
    const deburredKey = deburr(key);
    return /^([a-z]|[A-Z]){1}$/.test(deburredKey);
  }

  constructor(props) {
    super(props);
    this.state = { charPressedCount: 0 };
    this.onOpenClicked = this.onOpenClicked.bind(this);
    this.onCloseClicked = this.onCloseClicked.bind(this);
    this.onSelected = this.onSelected.bind(this);
    this.onAddNode = this.onAddNode.bind(this);
    this.onKeydown = this.onKeydown.bind(this);
    this.onKeyup = this.onKeyup.bind(this);
    this.isNodeSelected = this.isNodeSelected.bind(this);
    this.setDownshiftRef = element => {
      this.downshift = element;
    };
    this.setInputRef = element => {
      this.input = element;
    };

    document.addEventListener('keydown', this.onKeydown);
    document.addEventListener('keyup', this.onKeyup);
  }

  componentDidUpdate(prevProps) {
    if (this.input && !prevProps.isSearchOpen && this.props.isSearchOpen) {
      this.input.focus();
    }
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.onKeydown);
    document.removeEventListener('keyup', this.onKeyup);
  }

  onOpenClicked(e) {
    if (e) e.stopPropagation();
    this.props.setSankeySearchVisibility(true);
  }

  onCloseClicked(e) {
    if (e) e.stopPropagation();
    this.props.setSankeySearchVisibility(false);
  }

  onSelected(selectedItem) {
    if (this.isNodeSelected(selectedItem)) {
      this.downshift.clearSelection();
      return;
    }
    const ids = ToolSearch.getNodeIds(selectedItem);
    if (selectedItem.selected) {
      this.props.onRemoveNode(ids);
    } else {
      this.props.onAddNode(ids);
    }
    this.onCloseClicked();
  }

  onAddNode(e, selectedItem) {
    if (e) e.stopPropagation();
    const ids = ToolSearch.getNodeIds(selectedItem);
    this.props.onAddNode(ids);
    this.downshift.reset();
    this.input.focus();
  }

  onKeydown(e) {
    const { isSearchOpen } = this.props;
    const { charPressedCount } = this.state;

    // we won't open the search if any combination of keys is pressed
    if (!isSearchOpen && ToolSearch.isValidChar(e.key) && charPressedCount === 0) {
      this.onOpenClicked();
    } else if (isSearchOpen && e.key === 'Escape') {
      this.onCloseClicked();
    }

    this.setState(state => ({ charPressedCount: state.charPressedCount + 1 }));
  }

  onKeyup() {
    this.setState(state => ({ charPressedCount: state.charPressedCount - 1 }));
  }

  isNodeSelected(node) {
    return [node, node.exporter, node.importer]
      .filter(n => !!n)
      .map(n => n.id)
      .reduce((acc, next) => acc || this.props.selectedNodesIds.includes(next), false);
  }

  render() {
    const { isSearchOpen, className, nodes = [], selectedNodesIds = [] } = this.props;

    if (isSearchOpen === false) {
      return (
        <div onClick={this.onOpenClicked} className={className}>
          <svg className="icon icon-search">
            <use xlinkHref="#icon-search" />
          </svg>
        </div>
      );
    }

    return (
      <div className="c-search -tool">
        <svg className="icon icon-search">
          <use xlinkHref="#icon-search" />
        </svg>
        <div className="c-search__veil" onClick={this.onCloseClicked} />
        <div className="search-wrapper">
          <Downshift
            itemToString={i => (i === null ? '' : i.name)}
            onSelect={this.onSelected}
            ref={this.setDownshiftRef}
          >
            {({ getInputProps, getItemProps, isOpen, inputValue, highlightedIndex }) => (
              <div className="search-container" onClick={e => e.stopPropagation()}>
                <div className="search-bar">
                  <div style={{ overflow: selectedNodesIds.length > 3 ? 'auto' : 'inherit' }}>
                    <NodeTitleGroup />
                  </div>
                  <input
                    {...getInputProps({
                      placeholder: 'Search a producer, trader or country of import'
                    })}
                    ref={this.setInputRef}
                    className="search-bar-input"
                    type="search"
                  />
                </div>
                {isOpen && (
                  <ul className="search-results">
                    {nodes
                      .filter(
                        i => !inputValue || i.name.toLowerCase().includes(inputValue.toLowerCase())
                      )
                      .slice(0, 10)
                      .map((item, row) => (
                        <SearchResult
                          key={item.id + item.type}
                          value={inputValue}
                          isHighlighted={row === highlightedIndex}
                          item={item}
                          itemProps={getItemProps({ item })}
                          selected={this.isNodeSelected(item)}
                          onClickAdd={this.onAddNode}
                        />
                      ))}
                  </ul>
                )}
              </div>
            )}
          </Downshift>
        </div>
      </div>
    );
  }
}

ToolSearch.propTypes = {
  className: PropTypes.string,
  setSankeySearchVisibility: PropTypes.func,
  selectedNodesIds: PropTypes.array,
  nodes: PropTypes.array,
  isSearchOpen: PropTypes.bool,
  onAddNode: PropTypes.func,
  onRemoveNode: PropTypes.func
};
