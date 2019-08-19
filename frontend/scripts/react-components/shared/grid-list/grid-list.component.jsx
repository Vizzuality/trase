import React from 'react';
import PropTypes from 'prop-types';
import { FixedSizeGrid } from 'react-window';
import debounce from 'lodash/debounce';
import ShrinkingSpinner from '../shrinking-spinner/shrinking-spinner.component';

import './grid-list.scss';

class GridList extends React.Component {
  static propTypes = {
    page: PropTypes.number,
    loading: PropTypes.bool,
    groupBy: PropTypes.string,
    className: PropTypes.string,
    getMoreItems: PropTypes.func,
    items: PropTypes.array.isRequired,
    width: PropTypes.number.isRequired,
    children: PropTypes.func.isRequired,
    height: PropTypes.number.isRequired,
    rowHeight: PropTypes.number.isRequired,
    columnWidth: PropTypes.number.isRequired,
    columnCount: PropTypes.number.isRequired
  };

  static defaultProps = {
    getMoreItems: () => {},
    page: 1
  };

  debouncedGetMoreItemsCb = debounce(this.props.getMoreItems, 350);

  getMoreItems = ({ scrollTop, scrollUpdateWasRequested, verticalScrollDirection }) => {
    const { items, height, rowHeight, page, columnCount } = this.props;
    const current = Math.ceil((scrollTop + height) / rowHeight, 10);
    const buffer = 1;
    const pageEnd = Math.ceil(items.length / columnCount, 10);
    const reachedPageEnd = current === pageEnd;
    const reachedPageEndWithBuffer =
      current === pageEnd - buffer && page > GridList.defaultProps.page;

    if (
      (reachedPageEnd || reachedPageEndWithBuffer) &&
      !scrollUpdateWasRequested &&
      verticalScrollDirection === 'forward'
    ) {
      this.debouncedGetMoreItemsCb(page + 1, 'forward');
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
      loading
    } = this.props;
    const groupedItems = groupBy && this.getGroupedItems();

    return (
      <div className="c-grid-list">
        <FixedSizeGrid
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
        {loading && (
          <div className="grid-list-loading-container">
            <ShrinkingSpinner className="-small -dark grid-list-spinner" />
          </div>
        )}
      </div>
    );
  }
}

export default GridList;
