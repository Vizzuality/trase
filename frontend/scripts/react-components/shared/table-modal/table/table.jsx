import React, { useState, useRef, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import uniqBy from 'lodash/uniqBy';
import TableComponent from 'react-components/shared/table-modal/table/table.component';

const TableContainer = props => {
  const gridRef = useRef(null);
  const { headers } = props;
  const [sortedByColumn, setSortColumn] = useState(null);
  const [sortDirections, setSortDirection] = useState(
    headers.reduce((acc, current) => {
      acc[current.name] = 'ASC';
      return acc;
    }, {})
  );

  const headersIndexes = useMemo(
    () => headers.reduce((acc, next, index) => ({ ...acc, [next.name]: index }), {}),
    [headers]
  );

  const resetMaxLength = () =>
    gridRef.current.resetAfterIndices({
      rowIndex: 0,
      shouldForceUpdate: true
    });

  const toggleSortDirection = useCallback(
    columnName => {
      if (sortDirections[columnName] === 'ASC') {
        setSortDirection({
          ...sortDirections,
          [columnName]: 'DESC'
        });
      } else {
        setSortDirection({
          ...sortDirections,
          [columnName]: 'ASC'
        });
      }
    },
    [sortDirections]
  );

  const handleHeaderClick = useCallback(
    header => {
      if (sortedByColumn === header.name) {
        toggleSortDirection(header.name);
      } else {
        setSortColumn(header.name || '');
      }
      resetMaxLength();
    },
    [sortedByColumn, toggleSortDirection]
  );

  const sortedData = useMemo(() => {
    const { data } = props;
    const columnIndex = headersIndexes[sortedByColumn];
    if (uniqBy(data, item => item[columnIndex]).length === 1 || !sortedByColumn) {
      return data;
    }

    const result = [...data].sort((a, b) => {
      const first = a[columnIndex];
      const second = b[columnIndex];
      if (first === '' || first === null) return -1;
      if (second === '' || second === null) return 1;
      if (first === second) return 0;
      if (typeof first === 'number') {
        return first - second;
      }
      return first > second ? -1 : 1;
    });

    if (sortDirections[sortedByColumn] === 'ASC') {
      result.reverse();
    }
    return result;
  }, [props, headersIndexes, sortedByColumn, sortDirections]);

  if (!sortedData) return null;

  return (
    <TableComponent
      {...props}
      gridRef={gridRef}
      sortedData={sortedData}
      sortDirections={sortDirections}
      handleHeaderClick={handleHeaderClick}
      sortedByColumn={sortedByColumn}
    />
  );
};

TableContainer.propTypes = {
  loading: PropTypes.bool,
  className: PropTypes.string,
  headers: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number,
  rowHeight: PropTypes.number
};

export default TableContainer;
