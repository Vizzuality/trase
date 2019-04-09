import React, { useState } from 'react';
import PropTypes from 'prop-types';
import 'react-components/dashboard-element/dashboard-widget/table-modal/table/table.scss';
import ShrinkingSpinner from 'react-components/shared/shrinking-spinner/shrinking-spinner.component';
import { VariableSizeGrid } from 'react-window';
import cx from 'classnames';
import Text from 'react-components/shared/text';
import Icon from 'react-components/shared/icon';
import maxBy from 'lodash/maxBy';
import sortBy from 'lodash/sortBy';

const getMaxLength = row => String(maxBy(row, cell => String(cell).length)).length;

const sortByColumnIndex = (headers, sortByColumn) => {
  const column = headers.find(c => c.name === sortByColumn);
  return headers.indexOf(column);
};

const sortData = (data, headers, sortByColumn, sortDirection) => {
  let sortedData = data;
  sortedData = sortBy(data, [c => c[sortByColumnIndex(headers, sortByColumn)]]);
  if (sortDirection === 'ASC') sortedData.reverse();
  return sortedData;
};

function Table(props) {
  const [sortByColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState('ASC');
  const { data, headers, width, height, loading, rowHeight, className } = props;
  const gridRef = React.createRef();

  if (!data) return null;

  let sortedData = data;
  if (sortByColumn) {
    sortedData = sortData(data, headers, sortByColumn, sortDirection);
  }

  const columnWidth = width / headers.length;
  const minRowHeight = 50;

  const resetMaxLength = () => {
    gridRef.current.resetAfterIndices({
      rowIndex: 0,
      shouldForceUpdate: true
    });
  };

  const toggleSortDirection = () => {
    if (sortDirection === 'ASC') setSortDirection('DESC');
    else setSortDirection('ASC');
    resetMaxLength();
  };

  const handleHeaderClick = header => {
    if (sortByColumn === header.name) toggleSortDirection();
    else setSortColumn(header.name);
    resetMaxLength();
  };

  return (
    <div className={cx('c-table', className)}>
      <div className="table-header" style={{ width }}>
        {headers.map((header, index) => (
          <div
            className="header-item"
            key={`${header.name}${index}`}
            onClick={() => handleHeaderClick(header)}
            role="button"
            tabIndex={-1}
          >
            <Text color="white" weight="bold" size="md" variant="mono">
              <span className="header-item-name">{header.name}</span>
              {header.unit && <span> ({header.unit})</span>}
              <button className="sort-arrows">
                {sortByColumn === header.name && (
                  <Icon
                    icon={`icon-arrow${sortDirection === 'DESC' ? '-up' : ''}`}
                    color="elephant"
                  />
                )}
              </button>
            </Text>
          </div>
        ))}
      </div>
      <VariableSizeGrid
        ref={gridRef}
        className="c-grid-list"
        height={height}
        width={width}
        columnWidth={() => columnWidth}
        rowHeight={index => rowHeight || getMaxLength(sortedData[index]) + minRowHeight}
        rowCount={sortedData.length}
        columnCount={headers.length}
      >
        {({ rowIndex, columnIndex, style }) => {
          const item = sortedData[rowIndex][columnIndex];
          return (
            <div style={style} className={cx('list-item', !(rowIndex % 2) && 'list-item-even')}>
              <Text size="md" as="span" variant="mono">
                {item}
              </Text>
            </div>
          );
        }}
      </VariableSizeGrid>
      {loading && (
        <div className="grid-list-loading-container">
          <ShrinkingSpinner className="-small -dark grid-list-spinner" />
        </div>
      )}
    </div>
  );
}

Table.propTypes = {
  loading: PropTypes.bool,
  className: PropTypes.string,
  headers: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  rowHeight: PropTypes.number
};

export default Table;
