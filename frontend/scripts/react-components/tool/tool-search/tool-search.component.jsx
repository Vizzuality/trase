/* eslint-disable jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Downshift from 'downshift';
import deburr from 'lodash/deburr';
import sortBy from 'lodash/sortBy';
import levenshtein from 'fast-levenshtein';
import { defaultMemoize } from 'reselect';
import NodeTitleGroup from 'react-components/tool/tool-search/node-title-group/node-title-group.container';
import SearchResult from 'react-components/tool/tool-search/tool-search-result/tool-search-result.component';
import { MAX_SEARCH_RESULTS } from 'constants';

import 'scripts/react-components/tool/tool-search/tool-search.scss';
import 'scripts/react-components/tool/tool-search/tool-search-result/tool-search-result.scss';

export default class ToolSearch extends Component {
  static propTypes = {
    nodes: PropTypes.array,
    onAddNode: PropTypes.func,
    contextId: PropTypes.number,
    className: PropTypes.string,
    isSearchOpen: PropTypes.bool,
    isMapVisible: PropTypes.bool,
    defaultYear: PropTypes.number,
    selectedNodesIds: PropTypes.array,
    setSankeySearchVisibility: PropTypes.func
  };

  static isValidChar(key) {
    const deburredKey = deburr(key);
    return /^([a-z]|[A-Z]){1}$/.test(deburredKey);
  }

  static getNodeIds(selectedItem) {
    return selectedItem.id
      .toString()
      .split('_')
      .map(n => parseInt(n, 10));
  }

  state = { charPressedCount: 0 };

  componentDidMount() {
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

  setDownshiftRef = element => {
    this.downshift = element;
  };

  setInputRef = element => {
    this.input = element;
  };

  onOpenClicked = e => {
    if (e) e.stopPropagation();
    this.props.setSankeySearchVisibility(true);
  };

  onCloseClicked = e => {
    if (e) e.stopPropagation();
    this.props.setSankeySearchVisibility(false);
  };

  onSelected = selectedItem => {
    if (!selectedItem) return;

    if (this.isNodeSelected(selectedItem)) {
      this.downshift.clearSelection();
      return;
    }

    const ids = ToolSearch.getNodeIds(selectedItem);
    this.props.onAddNode(ids);
    this.onCloseClicked();
  };

  onAddNode = (e, item) => {
    const { onAddNode, selectedNodesIds } = this.props;
    if (e) e.stopPropagation();
    const ids = ToolSearch.getNodeIds(item).filter(id => !selectedNodesIds.includes(id));
    onAddNode(ids);
    this.downshift.reset();
    this.input.focus();
  };

  onKeydown = e => {
    const { isSearchOpen } = this.props;
    const { charPressedCount } = this.state;

    // we won't open the search if any combination of keys is pressed
    if (!isSearchOpen && ToolSearch.isValidChar(e.key) && charPressedCount === 0) {
      this.onOpenClicked();
    } else if (isSearchOpen && e.key === 'Escape') {
      this.onCloseClicked();
    }

    this.setState(state => ({ charPressedCount: state.charPressedCount + 1 }));
  };

  onKeyup = () => {
    this.setState(state => ({ charPressedCount: state.charPressedCount - 1 }));
  };

  isNodeSelected = node => {
    const ids = ToolSearch.getNodeIds(node);
    return ids.every(id => this.props.selectedNodesIds.includes(id));
  };

  // eslint-disable-next-line
  LEGACY_getSearchNodes(query) {
    const { nodes = [] } = this.props;
    return sortBy(
      nodes.filter(i => {
        if (!query) return true;
        const item = deburr(i.name.toLowerCase());
        return item.includes(query.toLowerCase());
      }),
      item => item.name
    ).slice(0, MAX_SEARCH_RESULTS);
  }

  getSearchNodes = defaultMemoize(query => {
    const { nodes = [] } = this.props;

    if (ENABLE_LEGACY_TOOL_SEARCH) {
      return this.LEGACY_getSearchNodes(query);
    }

    return sortBy(
      nodes.map(item => ({
        ...item,
        distance: levenshtein.get(deburr(query.toUpperCase()), deburr(item.name))
      })),
      item => item.distance
    ).slice(0, MAX_SEARCH_RESULTS);
  });

  render() {
    const {
      isSearchOpen,
      className,
      selectedNodesIds = [],
      isMapVisible,
      contextId,
      defaultYear
    } = this.props;

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
                    autoComplete="off"
                    ref={this.setInputRef}
                    className="search-bar-input"
                    type="search"
                  />
                </div>
                {isOpen && (
                  <ul className="search-results">
                    {this.getSearchNodes(inputValue).map((item, row) => (
                      <SearchResult
                        key={item.id + item.type}
                        value={inputValue}
                        isHighlighted={row === highlightedIndex}
                        isMapVisible={isMapVisible}
                        item={item}
                        contextId={contextId}
                        defaultYear={defaultYear}
                        itemProps={getItemProps({ item })}
                        selected={this.isNodeSelected(item)}
                        importerNotSelected={item.importer && !this.isNodeSelected(item.importer)}
                        exporterNotSelected={item.exporter && !this.isNodeSelected(item.exporter)}
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
