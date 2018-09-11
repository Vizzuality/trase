import React from 'react';
import PropTypes from 'prop-types';
import { FixedSizeGrid } from 'react-window';
import cx from 'classnames';

class GridList extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    getMoreItems: PropTypes.func,
    children: PropTypes.any,
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

  render() {
    const {
      className,
      height,
      width,
      columnWidth,
      rowHeight,
      items,
      columnCount,
      children
    } = this.props;
    return (
      <FixedSizeGrid
        ref={this.listRef}
        className={cx('c-grid-list', 'List', className)}
        height={height}
        width={width}
        columnWidth={columnWidth}
        rowHeight={rowHeight}
        itemData={items}
        rowCount={items.length}
        columnCount={columnCount}
        onScroll={this.getMoreItems}
      >
        {({ rowIndex, columnIndex, style, data }) => {
          const itemProps = data[rowIndex * columnCount + columnIndex];
          if (!itemProps || !children) return null;
          return React.createElement(children, { ...itemProps, style });
        }}
      </FixedSizeGrid>
    );
  }
}

export default GridList;
