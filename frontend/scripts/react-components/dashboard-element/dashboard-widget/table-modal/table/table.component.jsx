import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import 'react-components/dashboard-element/dashboard-widget/table-modal/table/table.scss';
import ShrinkingSpinner from 'react-components/shared/shrinking-spinner/shrinking-spinner.component';
import { VariableSizeGrid } from 'react-window';
import cx from 'classnames';
import Text from 'react-components/shared/text';
import Icon from 'react-components/shared/icon';
import maxBy from 'lodash/maxBy';
import uniq from 'lodash/uniq';

const getMaxLength = row => String(maxBy(row, cell => String(cell).length)).length;

const columnNameIndex = (headers, columnName) => {
  const column = headers.find(c => c.name === columnName);
  return headers.indexOf(column);
};

const sortData = (data, headers, sortByColumn, sortDirections) => {
  let sortedData = data;
  const columnIndex = columnNameIndex(headers, sortByColumn);
  sortedData = data.sort((a, b) => {
    const first = a[columnIndex];
    const second = b[columnIndex];
    if (first === '' || first === null) return -1;
    if (second === '' || second === null) return 1;
    if (first === second) return 0;
    const isNumber = /^[\d|.]+\D?$/; // We have to take into account the SI numbers e.g "14.3M"
    if (String(first).match(isNumber)) {
      return parseFloat(first) - parseFloat(second);
    }
    return first > second ? -1 : 1;
  });

  if (
    sortDirections[sortByColumn] === 'ASC' &&
    uniq(sortedData.map(d => d[columnIndex])).length > 1
  )
    sortedData.reverse();
  return sortedData;
};

const initialSortDirections = headers =>
  headers.reduce((acc, current) => {
    acc[current.name] = 'ASC';
    return acc;
  }, {});

function Table(props) {
  const gridRef = useRef(null);
  const [sortByColumn, setSortColumn] = useState(null);
  const { data, headers, width, height, loading, rowHeight, className } = props;
  const [sortDirections, setSortDirection] = useState(initialSortDirections(headers));

  if (!data) return null;

  let sortedData = data;
  if (sortByColumn) {
    sortedData = sortData(data, headers, sortByColumn, sortDirections);
  }

  const resetMaxLength = () => {
    gridRef.current.resetAfterIndices({
      rowIndex: 0,
      shouldForceUpdate: true
    });
  };

  const toggleSortDirection = columnName => {
    if (sortDirections[columnName] === 'ASC') {
      setSortDirection({ ...sortDirections, [columnName]: 'DESC' });
    } else {
      setSortDirection({ ...sortDirections, [columnName]: 'ASC' });
    }
    resetMaxLength();
  };

  const handleHeaderClick = header => {
    if (sortByColumn === header.name) toggleSortDirection(header.name);
    else setSortColumn(header.name);
    resetMaxLength();
  };

  const columnWidth = width / headers.length;
  const minRowHeight = 50;
  return (
    <div className={cx('c-table', className)}>
      <div className="table-header" style={{ width }}>
        {headers.map((header, index) => {
          const isDESC = sortDirections[header.name] === 'DESC';
          return (
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
                    <Icon icon={`icon-arrow${isDESC ? '-up' : ''}`} color="elephant" />
                  )}
                </button>
              </Text>
            </div>
          );
        })}
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
