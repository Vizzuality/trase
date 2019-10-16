import React from 'react';
import PropTypes from 'prop-types';
import ColumnSelector from 'react-components/tool/column-selector/column-selector.container';
import cx from 'classnames';
import 'react-components/tool/columns-selector-group/columns-selector-group.scss';

function ColumnsSelectorGroup(props) {
  const { sankeySize, columns, selectedColumnsIds } = props;
  const loading = !columns || columns.length === 0;
  const styles = { width: `${sankeySize[0] + 8}px` };

  return (
    <div style={styles} className={cx('c-columns-selector-group', { '-loading': loading })}>
      {!loading &&
        selectedColumnsIds.map(
          (selectedColumnId, i) =>
            console.log(selectedColumnsIds, i) || (
              <ColumnSelector
                key={`column-selector-${i}`}
                position={i}
                group={columns[selectedColumnId].group}
                selectedColumnId={selectedColumnId}
              />
            )
        )}
    </div>
  );
}

ColumnsSelectorGroup.propTypes = {
  sankeySize: PropTypes.array,
  columns: PropTypes.object,
  selectedColumnsIds: PropTypes.number
};

export default ColumnsSelectorGroup;
