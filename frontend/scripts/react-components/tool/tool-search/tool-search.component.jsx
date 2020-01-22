/* eslint-disable jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Downshift from 'downshift';
import deburr from 'lodash/deburr';
import { FixedSizeList } from 'react-window';
import NodeTitleGroup from 'react-components/tool/tool-search/node-title-group/node-title-group.container';
import SearchResult from 'react-components/tool/tool-search/tool-search-result/tool-search-result.component';

import 'scripts/react-components/tool/tool-search/tool-search.scss';
import 'scripts/react-components/tool/tool-search/tool-search-result/tool-search-result.scss';

export default class ToolSearch extends Component {
  static propTypes = {
    nodes: PropTypes.array,
    onAddResult: PropTypes.func,
    contextId: PropTypes.number,
    className: PropTypes.string,
    isSearchOpen: PropTypes.bool,
    toolLayout: PropTypes.number,
    selectedNodesIds: PropTypes.array,
    setIsSearchOpen: PropTypes.func,
    onInputValueChange: PropTypes.func
  };

  static isValidChar(key) {
    const deburredKey = deburr(key);
    return /^([a-z]|[A-Z]){1}$/.test(deburredKey);
  }

  static getNodeResults(selectedItem) {
    const nodeTypes = selectedItem.nodeType.split(' & ');
    const ids = ToolSearch.getNodeIds(selectedItem);
    return nodeTypes.map((nodeType, i) => ({
      nodeType,
      id: ids[i],
      contextId: selectedItem.contextId
    }));
  }

  static getNodeIds(selectedItem) {
    return selectedItem.id
      .toString()
      .split('_')
      .map(n => parseInt(n, 10));
  }

  state = { charPressedCount: 0, inputValue: '' };

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
    this.props.setIsSearchOpen(true);
  };

  onCloseClicked = e => {
    if (e) e.stopPropagation();
    this.props.setIsSearchOpen(false);
  };

  addResult = item => {
    const { onAddResult, selectedNodesIds } = this.props;
    const results = ToolSearch.getNodeResults(item);
    // Select only the results in the IMPORTER_EXPORTER pair that are not already selected
    const notSelectedResults = results.filter(result => !selectedNodesIds.includes(result.id));
    onAddResult(notSelectedResults);
  };

  onSelected = selectedItem => {
    if (!selectedItem) return;

    if (this.isNodeSelected(selectedItem)) {
      this.downshift.clearSelection();
      return;
    }

    this.addResult(selectedItem);
    this.onCloseClicked();
  };

  handleClickAdd = (e, item) => {
    if (e) e.stopPropagation();
    this.addResult(item);
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

  onInputValueChange = value => {
    this.setState({ inputValue: value });
    this.debouncedInputValueChange(value);
  };

  debouncedInputValueChange = value => {
    const { contextId } = this.props;
    this.props.onInputValueChange(value, contextId);
  };

  onDownshiftStateChange = state => {
    if (state.inputValue !== undefined) {
      this.onInputValueChange(state.inputValue);
    }
  };

  isNodeSelected = node => {
    const ids = ToolSearch.getNodeIds(node);
    return ids.every(id => this.props.selectedNodesIds.includes(id));
  };

  render() {
    const {
      isSearchOpen,
      className,
      selectedNodesIds = [],
      toolLayout,
      contextId,
      nodes
    } = this.props;

    const { inputValue } = this.state;

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
            onStateChange={this.onDownshiftStateChange}
          >
            {({ getInputProps, getItemProps, isOpen, highlightedIndex }) => (
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
                  <FixedSizeList
                    height={345}
                    width={window.innerWidth}
                    itemSize={85}
                    itemData={nodes}
                    itemCount={nodes.length}
                    innerElementType="ul"
                    className="search-results"
                  >
                    {({ index, style, data }) => {
                      const item = data[index];
                      return (
                        <SearchResult
                          style={style}
                          key={index}
                          value={inputValue}
                          isHighlighted={
                            item?.id === (nodes[highlightedIndex] && nodes[highlightedIndex].id)
                          }
                          toolLayout={toolLayout}
                          item={item}
                          contextId={contextId}
                          itemProps={getItemProps({ item })}
                          selected={this.isNodeSelected(item)}
                          importerNotSelected={item.importer && !this.isNodeSelected(item.importer)}
                          exporterNotSelected={item.exporter && !this.isNodeSelected(item.exporter)}
                          onClickAdd={this.handleClickAdd}
                        />
                      );
                    }}
                  </FixedSizeList>
                )}
              </div>
            )}
          </Downshift>
        </div>
      </div>
    );
  }
}
