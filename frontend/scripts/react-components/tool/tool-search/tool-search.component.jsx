/* eslint-disable jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */
import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import Downshift from 'downshift';
import { FixedSizeList } from 'react-window';
import NodeTitleGroup from 'react-components/tool/tool-search/node-title-group/node-title-group.container';
import SearchResult from 'react-components/tool/tool-search/tool-search-result/tool-search-result.component';
import cx from 'classnames';

import 'scripts/react-components/tool/tool-search/tool-search.scss';
import 'scripts/react-components/tool/tool-search/tool-search-result/tool-search-result.scss';

const getNodeIds = selectedItem =>
  selectedItem.nodes ? selectedItem.nodes.map(key => selectedItem[key].id) : [selectedItem.id];

const getNodeResults = selectedItem =>
  selectedItem.nodes ? selectedItem.nodes.map(key => selectedItem[key]) : [selectedItem];

function useCloseOnEscape({ isSearchOpen, setIsSearchOpen }) {
  useEffect(() => {
    const onKeydown = e => {
      // we won't open the search if any combination of keys is pressed
      if (isSearchOpen && e.key === 'Escape') {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener('keydown', onKeydown);

    return () => {
      document.removeEventListener('keydown', onKeydown);
    };
  }, [isSearchOpen, setIsSearchOpen]);
}

function ToolSearch(props) {
  const { isSearchOpen, className, selectedNodesIds = [], toolLayout, contextId, nodes } = props;

  const [inputValue, setInputValue] = useState('');
  const downshift = useRef(null);
  const input = useRef(null);
  useCloseOnEscape(props);

  const onOpenClicked = e => {
    if (e) e.stopPropagation();
    props.setIsSearchOpen(true);
  };

  const onCloseClicked = e => {
    if (e) e.stopPropagation();
    props.setIsSearchOpen(false);
  };

  useEffect(() => {
    if (input && isSearchOpen) {
      input.current.focus();
    }
  }, [isSearchOpen]);

  const addResult = item => {
    const results = getNodeResults(item);
    // Select only the results in the IMPORTER_EXPORTER pair that are not already selected
    const notSelectedResults = results.filter(result => !selectedNodesIds.includes(result.id));
    props.onAddResult(notSelectedResults);
  };

  const isNodeSelected = node => {
    const ids = getNodeIds(node);
    return ids.every(id => props.selectedNodesIds.includes(id));
  };

  const onSelected = selectedItem => {
    if (!selectedItem) return;

    if (isNodeSelected(selectedItem)) {
      downshift.current.clearSelection();
      return;
    }

    addResult(selectedItem);
    onCloseClicked();
  };

  const handleClickAdd = (e, item) => {
    if (e) e.stopPropagation();
    addResult(item);
    downshift.current.reset();
    input.current.focus();
  };

  const onInputValueChange = value => {
    setInputValue(() => value);
    props.onInputValueChange(value, contextId);
  };

  const onDownshiftStateChange = newState => {
    if (newState.inputValue !== undefined) {
      onInputValueChange(newState.inputValue);
    }
  };

  if (isSearchOpen === false) {
    return (
      <div onClick={onOpenClicked} className={cx('c-tool-search', className)}>
        <svg className="icon icon-search">
          <use xlinkHref="#icon-search" />
        </svg>
      </div>
    );
  }

  return (
    <div className="c-tool-search c-search -tool">
      <svg className="icon icon-search">
        <use xlinkHref="#icon-search" />
      </svg>
      <div className="c-search__veil" onClick={onCloseClicked} />
      <div className="search-wrapper">
        <Downshift
          itemToString={i => (i === null ? '' : i.name)}
          onSelect={onSelected}
          ref={downshift}
          defaultHighlightedIndex={0}
          itemCount={nodes.length}
          onStateChange={onDownshiftStateChange}
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
                  ref={input}
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
                        isHighlighted={index === highlightedIndex}
                        toolLayout={toolLayout}
                        item={item}
                        contextId={contextId}
                        itemProps={getItemProps({ item })}
                        selected={isNodeSelected(item)}
                        importerNotSelected={item.importer && !isNodeSelected(item.importer)}
                        exporterNotSelected={item.exporter && !isNodeSelected(item.exporter)}
                        onClickAdd={handleClickAdd}
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

ToolSearch.propTypes = {
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

export default ToolSearch;
