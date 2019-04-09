import React from 'react';
import PropTypes from 'prop-types';
import 'react-components/dashboard-element/dashboard-widget/table-modal/table/table.scss';
import ShrinkingSpinner from 'react-components/shared/shrinking-spinner/shrinking-spinner.component';
import { VariableSizeGrid } from 'react-window';
import cx from 'classnames';
import Text from 'react-components/shared/text';
import maxBy from 'lodash/maxBy';

const getMaxLength = row => String(maxBy(row, cell => String(cell).length)).length;

function Table(props) {
  const { data, headers, width, height, loading, rowHeight, className } = props;
  if (!data) return null;
  const columnWidth = width / headers.length;
  const minRowHeight = 50;

  return (
    <div className={cx('c-table', className)}>
      <div className="table-header" style={{ width }}>
        {headers.map((header, index) => (
          <div className="header-item" key={`${header.name}${index}`}>
            <Text color="white" weight="bold" size="md" variant="mono">
              <span className="header-item-name">{header.name}</span>
              {header.unit && <span> ({header.unit})</span>}
            </Text>
          </div>
        ))}
      </div>
      <VariableSizeGrid
        className="c-grid-list"
        height={height}
        width={width}
        columnWidth={() => columnWidth}
        rowHeight={index => rowHeight || getMaxLength(data[index]) + minRowHeight}
        rowCount={data.length}
        columnCount={headers.length}
      >
        {({ rowIndex, columnIndex, style }) => {
          const item = data[rowIndex][columnIndex];
          if (typeof item === 'undefined') return null;
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
