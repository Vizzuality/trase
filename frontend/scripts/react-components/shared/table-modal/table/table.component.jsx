import React from 'react';
import PropTypes from 'prop-types';
import 'react-components/shared/table-modal/table/table.scss';
import ShrinkingSpinner from 'react-components/shared/shrinking-spinner/shrinking-spinner.component';
import { VariableSizeGrid } from 'react-window';
import cx from 'classnames';
import Text from 'react-components/shared/text';
import Icon from 'react-components/shared/icon';
import maxBy from 'lodash/maxBy';
import { format as d3Format } from 'd3-format';

const getMaxLength = row => String(maxBy(row, cell => String(cell).length)).length;

function Table(props) {
  const {
    sortedData,
    sortedByColumn,
    gridRef,
    sortDirections,
    handleHeaderClick,
    headers,
    width,
    height,
    loading,
    rowHeight,
    className
  } = props;
  const columnWidth = width / headers.length;
  const minRowHeight = 50;
  return (
    <div className={cx('c-table', className)}>
      <div className="table-header" style={{ width }}>
        {headers.map((header, index) => {
          const isDesc = sortDirections[header.name] === 'DESC';
          return (
            <div
              className="header-item"
              key={`${header.name}${index}`}
              onClick={() => handleHeaderClick(header)}
              role="button"
              tabIndex={-1}
            >
              <button className="sort-arrows">
                <Text color="white" weight="bold" size="md" variant="mono">
                  <span className="header-item-name">{header.name}</span>
                  {header.unit && <span> ({header.unit})</span>}
                </Text>
                <span className="icon-container">
                  {sortedByColumn === header.name && (
                    <Icon icon={`icon-arrow${isDesc ? '-up' : ''}`} color="elephant" />
                  )}
                </span>
              </button>
            </div>
          );
        })}
      </div>
      <VariableSizeGrid
        ref={gridRef}
        height={height || minRowHeight * sortedData.length}
        width={width}
        columnWidth={() => columnWidth}
        rowHeight={index => rowHeight || getMaxLength(sortedData[index]) + minRowHeight}
        rowCount={sortedData.length}
        columnCount={headers.length}
      >
        {({ rowIndex, columnIndex, style }) => {
          const formatFn = headers[columnIndex].format && d3Format(headers[columnIndex].format);
          const cell = sortedData[rowIndex][columnIndex];
          const item = cell !== null ? cell : 'n/a';
          const isPlainItem = typeof item !== 'object';
          const renderItem = () => {
            const text = isPlainItem ? item : item.value;
            if (formatFn && (text === 0 || text) && !Number.isNaN(parseFloat(text))) {
              return formatFn(text);
            }
            return text;
          };
          return (
            <div style={style} className={cx('list-item', !(rowIndex % 2) && '-even')}>
              <Text align="center" size="md" as="span" variant="mono" transform="uppercase">
                {renderItem()}
                {!isPlainItem && (
                  <>
                    {' '}
                    <Text align="center" size="md" as="span" variant="mono" transform="none">
                      {item.suffix}
                    </Text>
                  </>
                )}
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
  width: PropTypes.number.isRequired,
  height: PropTypes.number,
  rowHeight: PropTypes.number,
  gridRef: PropTypes.any,
  sortedData: PropTypes.array.isRequired,
  sortDirections: PropTypes.object,
  handleHeaderClick: PropTypes.func.isRequired,
  sortedByColumn: PropTypes.func
};

export default Table;
