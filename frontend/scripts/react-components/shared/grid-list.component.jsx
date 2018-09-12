import React from 'react';
import PropTypes from 'prop-types';
import { FixedSizeGrid } from 'react-window';

class GridList extends React.Component {
  static propTypes = {
    children: PropTypes.any,
    noScroll: PropTypes.bool,
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
    getMoreItems: () => {}
  };

  state = {
    rowCount: 5
  };

  listRef = React.createRef();

  componentDidUpdate(_, prevState) {
    if (this.state.rowCount !== prevState.rowCount) {
      this.listRef.current.scrollToItem({
        rowIndex: prevState.rowCount - 1,
        columnIndex: 0,
        align: 'start'
      });
    }
  }

  getMoreItems = ({ scrollTop, scrollUpdateWasRequested }) => {
    const { getMoreItems, items, height, rowHeight } = this.props;
    if (
      parseInt((scrollTop + height) / rowHeight, 10) === items.length &&
      !scrollUpdateWasRequested
    ) {
      getMoreItems();
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
        grouped.push(item, null, null);
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
      noScroll
    } = this.props;
    const groupedItems = groupBy && this.getGroupedItems();
    return (
      <FixedSizeGrid
        ref={this.listRef}
        className={className}
        style={{ overflow: noScroll ? 'hidden' : 'auto' }}
        height={height}
        width={width}
        columnWidth={columnWidth}
        rowHeight={rowHeight}
        itemData={groupedItems || items}
        rowCount={(groupedItems || items).length}
        columnCount={columnCount}
        onScroll={this.getMoreItems}
      >
        {({ rowIndex, columnIndex, style, data }) => {
          const item = data[rowIndex * columnCount + columnIndex];
          if (typeof item === 'undefined' || !children) return null;
          return children({ item, style, isGroup: item && !!item[groupBy] });
        }}
      </FixedSizeGrid>
    );
  }
}

export default GridList;
