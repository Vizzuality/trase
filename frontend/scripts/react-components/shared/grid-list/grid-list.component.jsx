import React, { useCallback, useMemo, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { FixedSizeGrid } from 'react-window';
import debounce from 'lodash/debounce';
import ShrinkingSpinner from '../shrinking-spinner/shrinking-spinner.component';

import './grid-list.scss';

function useMoreItems({ getMoreItems, rowHeight, height, columnCount, items, page }) {
  const debouncedGetMoreItemsCb = useCallback(debounce(getMoreItems, 350), [getMoreItems]);

  return useCallback(
    ({ scrollTop, scrollUpdateWasRequested, verticalScrollDirection }) => {
      const current = Math.ceil((scrollTop + height) / rowHeight);
      const buffer = 1;
      const pageEnd = Math.ceil(items.length / columnCount);
      const reachedPageEnd = current === pageEnd;
      const reachedPageEndWithBuffer = current === pageEnd - buffer && page > 1;

      if (
        (reachedPageEnd || reachedPageEndWithBuffer) &&
        !scrollUpdateWasRequested &&
        verticalScrollDirection === 'forward'
      ) {
        debouncedGetMoreItemsCb(page + 1, 'forward');
      }
    },
    [height, rowHeight, items.length, columnCount, page, debouncedGetMoreItemsCb]
  );
}

function useGroupedItems({ groupBy, columnCount, items }) {
  return useMemo(() => {
    if (!groupBy) {
      return null;
    }

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
  }, [groupBy, columnCount, items]);
}

function useScrollToItemId({ itemToScrollTo, columnCount, items }) {
  const ref = useRef(null);
  useEffect(() => {
    if (itemToScrollTo?.id && ref.current) {
      const currentFirstRowIndex = items.findIndex(i => i.id === itemToScrollTo.id);
      if (currentFirstRowIndex !== -1) {
        const rowIndex = Math.ceil(currentFirstRowIndex / columnCount);

        ref.current.scrollToItem({
          rowIndex,
          columnIndex: 0,
          align: 'start'
        });
      }
    }
    // we dont want to scroll to item, every time the items change
    // eslint-disable-next-line
  }, [itemToScrollTo, columnCount]);

  return ref;
}

function GridList(props) {
  const {
    items,
    height,
    rowHeight,
    columnCount,
    groupBy,
    className,
    width,
    columnWidth,
    children,
    loading,
    innerElementType,
    outerElementType
  } = props;

  const groupedItems = useGroupedItems(props);
  const onScrollCb = useMoreItems(props);
  const fixedSizeGridRef = useScrollToItemId(props);

  return (
    <div className="c-grid-list">
      <FixedSizeGrid
        ref={fixedSizeGridRef}
        className={className}
        height={height}
        width={width}
        columnWidth={columnWidth}
        rowHeight={rowHeight}
        itemData={groupedItems || items}
        rowCount={Math.ceil((groupedItems || items).length / columnCount)}
        columnCount={columnCount}
        onScroll={onScrollCb}
        innerElementType={innerElementType}
        outerElementType={outerElementType}
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

GridList.propTypes = {
  page: PropTypes.number, // eslint-disable-line
  loading: PropTypes.bool,
  groupBy: PropTypes.string,
  className: PropTypes.string,
  getMoreItems: PropTypes.func, // eslint-disable-line
  itemToScrollTo: PropTypes.object, // eslint-disable-line
  items: PropTypes.array.isRequired,
  width: PropTypes.number.isRequired,
  children: PropTypes.func.isRequired,
  height: PropTypes.number.isRequired,
  rowHeight: PropTypes.number.isRequired,
  innerElementType: PropTypes.elementType,
  outerElementType: PropTypes.elementType,
  columnWidth: PropTypes.number.isRequired,
  columnCount: PropTypes.number.isRequired
};

GridList.defaultProps = {
  getMoreItems: () => {},
  page: 1
};

export default GridList;
