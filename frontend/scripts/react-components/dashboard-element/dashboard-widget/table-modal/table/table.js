import { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import uniq from 'lodash/uniq';
import TableComponent from 'react-components/dashboard-element/dashboard-widget/table-modal/table/table.component';

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

const TableContainer = props => {
  const gridRef = useRef(null);
  const { headers } = props;
  const [sortByColumn, setSortColumn] = useState(null);
  const [sortDirections, setSortDirection] = useState(initialSortDirections(headers));

  const resetMaxLength = () => {
    gridRef.current.resetAfterIndices({
      rowIndex: 0,
      shouldForceUpdate: true
    });
  };

  const toggleSortDirection = columnName => {
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
    resetMaxLength();
  };

  const handleHeaderClick = header => {
    if (sortByColumn === header.name) toggleSortDirection(header.name);
    else setSortColumn(header.name);
    resetMaxLength();
  };

  const { data } = props;

  if (!data) return null;

  let sortedData = data;
  if (sortByColumn) {
    sortedData = sortData(data, headers, sortByColumn, sortDirections);
  }

  return TableComponent({
    ...props,
    gridRef,
    sortedData,
    sortDirections,
    handleHeaderClick,
    sortByColumn
  });
};

TableContainer.propTypes = {
  loading: PropTypes.bool,
  className: PropTypes.string,
  headers: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  rowHeight: PropTypes.number
};

export default TableContainer;
