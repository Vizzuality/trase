import React from 'react';
import PropTypes from 'prop-types';
import 'react-components/table-modal/table-modal.scss';
import { Table as VirtualizedTable, Column } from 'react-virtualized/dist/commonjs/Table';
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';

function Table({ data }) {
  console.log('data', data);
  if (!data) return null;
  return (
    <div className="c-table">
      <AutoSizer disableHeight>
        {({ width }) => (
          <VirtualizedTable
            rowCount={data.length}
            width={width}
            height={500}
            rowGetter={({ index }) => data[index]}
            rowHeight={30}
          >
            {data.map(column => (
              <Column
                className="table-column"
                key={column}
                dataKey={column}
                flexGrow={0}
                width={100}
              />
            ))}
          </VirtualizedTable>
        )}
      </AutoSizer>
    </div>
  );
}

Table.propTypes = {
  data: PropTypes.array
};

export default Table;
