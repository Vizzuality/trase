import React from 'react';
import PropTypes from 'prop-types';
import { FixedSizeGrid } from 'react-window';
import debounce from 'lodash/debounce';
import ShrinkingSpinner from '../shrinking-spinner/shrinking-spinner.component';

import './grid-list.scss';

class GridList extends React.Component {
  static propTypes = {
    page: PropTypes.number,
    children: PropTypes.any,
    loading: PropTypes.bool,
    loadingMoreItems: PropTypes.bool,
    groupBy: PropTypes.string,
    className: PropTypes.string,
    getMoreItems: PropTypes.func,
    items: PropTypes.array.isRequired,
    height: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    rowHeight: PropTypes.number.isRequired,
    columnWidth: PropTypes.number.isRequired,
    columnCount: PropTypes.number.isRequired
  };

  static defaultProps = {
    getMoreItems: () => {},
    page: 1
  };

  listRef = React.createRef();

  debouncedGetMoreItemsCb = debounce(this.props.getMoreItems, 150);

  componentDidUpdate(prevProps) {
    const { items, columnCount } = this.props;
    if (prevProps.items.length > 0 && items.length !== prevProps.items.length) {
      const prevLastRow = prevProps.items[prevProps.items.length - 1];
      const currentFirstRowIndex = items.findIndex(i => i.id === (prevLastRow && prevLastRow.id));
      const buffer = 1;
      const rowIndex = Math.ceil(parseInt(currentFirstRowIndex / columnCount, 10)) - buffer;

      this.listRef.current.scrollToItem({
        rowIndex,
        columnIndex: 0,
        align: 'start'
      });
    }
  }

  getMoreItems = ({ scrollTop, scrollUpdateWasRequested }) => {
    const { items, height, rowHeight, page, columnCount } = this.props;
    const current = parseInt((scrollTop + height) / rowHeight, 10);
    const buffer = 1;
    const pageEnd = parseInt(items.length / columnCount, 10);
    const reachedPageEnd = current === pageEnd;
    const reachedPageEndWithBuffer =
      current === pageEnd - buffer && page > GridList.defaultProps.page;

    // TODO: add backwards support
    // const reachedPageStart = current === columnCount;
    // if (reachedPageStart && !scrollUpdateWasRequested && page > 0) {
    //   getMoreItems(page - 1, 'backwards');
    // }
    if ((reachedPageEnd || reachedPageEndWithBuffer) && !scrollUpdateWasRequested) {
      this.debouncedGetMoreItemsCb(page + 1, 'forwards');
    }
  };

  getGroupedItems() {
    const { groupBy, items, columnCount } = this.props;
    const grouped = [];
    items.forEach(item => {
      const index = grouped.length;
      if (item[groupBy]) {
        if (index % columnCount !== 0) {
          grouped.push(...Array(columnCount - (index % columnCount)).fill(null));
        }
        grouped.push(item, ...Array(columnCount - 1).fill(null));
      } else {
        grouped.push(item);
      }
    });
    return grouped;
  }

  render() {
    const {
      className,
      height,
      width,
      columnWidth,
      rowHeight,
      items,
      columnCount,
      children,
      groupBy,
      loading,
      loadingMoreItems
    } = this.props;
    const groupedItems = groupBy && this.getGroupedItems();
    const isLoading = loading || loadingMoreItems;

    return (
      <div className="c-grid-list">
        <FixedSizeGrid
          ref={this.listRef}
          className={className}
          height={height}
          width={width}
          columnWidth={columnWidth}
          rowHeight={rowHeight}
          itemData={groupedItems || items}
          rowCount={Math.ceil((groupedItems || items).length / columnCount)}
          columnCount={columnCount}
          onScroll={this.getMoreItems}
        >
          {({ rowIndex, columnIndex, style, data }) => {
            const item = data[rowIndex * columnCount + columnIndex];
            if (typeof item === 'undefined' || !children) return null;
            return children({ item, style, isGroup: item && !!item[groupBy] });
          }}
        </FixedSizeGrid>
        {isLoading && (
          <div className="grid-list-loading-container">
            <ShrinkingSpinner className="-small -dark grid-list-spinner" />
          </div>
        )}
      </div>
    );
  }
}

export default GridList;
