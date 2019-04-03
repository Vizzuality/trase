import React from 'react';
import PropTypes from 'prop-types';
import 'react-components/table-modal/table/table.scss';
import ShrinkingSpinner from 'react-components/shared/shrinking-spinner/shrinking-spinner.component';
import { VariableSizeGrid } from 'react-window';
import cx from 'classnames';
import Text from 'react-components/shared/text';
import maxBy from 'lodash/maxBy';

const getMaxLength = row => String(maxBy(row, cell => String(cell).length)).length;

function Table(props) {
  const { data, headings, width, height, loading, rowHeight, className } = props;
  if (!data) return null;
  const columnWidth = width / headings.length;
  const minRowHeight = 50;

  return (
    <table className={cx('c-table', className)}>
      <thead>
        <tr className="table-heading" style={{ width }}>
          {headings.map((h, index) => (
            <th className="header-item" key={`${h}${index}`}>
              <Text color="white" weight="bold" size="md" variant="mono">
                {h}
              </Text>
            </th>
          ))}
        </tr>
      </thead>
      <VariableSizeGrid
        className={cx('c-grid-list')}
        height={height}
        width={width}
        outerElementType="tbody"
        innerElementType="tr"
        columnWidth={() => columnWidth}
        rowHeight={index => rowHeight || getMaxLength(data[index]) + minRowHeight}
        rowCount={data.length}
        columnCount={headings.length}
      >
        {({ rowIndex, columnIndex, style }) => {
          const item = data[rowIndex][columnIndex];
          if (typeof item === 'undefined') return null;
          return (
            <td
              style={style}
              className={cx('header-item', rowIndex % 2 ? 'list-item-odd' : 'list-item-even')}
            >
              <Text size="md" as="span" variant="mono">
                {item}
              </Text>
            </td>
          );
        }}
      </VariableSizeGrid>
      {loading && (
        <div className="grid-list-loading-container">
          <ShrinkingSpinner className="-small -dark grid-list-spinner" />
        </div>
      )}
    </table>
  );
}

Table.propTypes = {
  loading: PropTypes.bool,
  className: PropTypes.string,
  headings: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  rowHeight: PropTypes.number
};

export default Table;
