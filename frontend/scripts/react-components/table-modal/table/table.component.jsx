import React from 'react';
import PropTypes from 'prop-types';
import 'react-components/table-modal/table/table.scss';
import ShrinkingSpinner from 'react-components/shared/shrinking-spinner/shrinking-spinner.component';
import { FixedSizeGrid } from 'react-window';
import cx from 'classnames';
import Text from 'react-components/shared/text';

function Table(props) {
  const { data, headings, width, height, rowHeight, loading, className } = props;

  if (!data) return null;
  const columnWidth = width / headings.length;

  return (
    <table className="c-table">
      <tbody>
        <tr className="table-heading" style={{ width }}>
          {headings.map((h, index) => (
            <th className="header-item" key={`${h}${index}`}>
              <Text color="white" weight="bold" size="md" variant="mono">
                {h}
              </Text>
            </th>
          ))}
        </tr>
        <FixedSizeGrid
          className={cx('c-grid-list', className)}
          height={height}
          width={width}
          columnWidth={columnWidth}
          rowHeight={rowHeight}
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
        </FixedSizeGrid>
      </tbody>
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
  data: PropTypes.array.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  rowHeight: PropTypes.number.isRequired,
  headings: PropTypes.array.isRequired
};

export default Table;
