import React, { useMemo } from 'react';
import { connect } from 'react-redux';
import { selectColumn } from 'react-components/tool/tool.actions';
import ColumnSelector from 'react-components/tool/column-selector/column-selector.component';
import PropTypes from 'prop-types';
import { getSelectedColumnsIds } from 'react-components/tool/tool.selectors';

const mapStateToProps = state => ({
  columns: Object.values(state.toolLinks.data.columns || {}),
  selectedColumnsIds: getSelectedColumnsIds(state),
  nodesColoredAtColumn: state.toolLinks.nodesColoredAtColumn
});

const mapDispatchToProps = dispatch => ({
  onColumnSelected: (columnIndex, columnId) => {
    dispatch(selectColumn(columnIndex, columnId));
  }
});

function ColumnSelectorContainer({ columns, group, selectedColumnsIds, onColumnSelected }) {
  const columnItems = useMemo(() => columns.filter(column => column.group === group), [
    columns,
    group
  ]);
  const selectedColumnItem = useMemo(
    () => columnItems.filter(column => column.id === selectedColumnsIds[group])[0],
    [columnItems, selectedColumnsIds, group]
  );

  const handleColumnSelected = ({ item }) => {
    const updatedColumnItem = columnItems.find(c => c.id === item.value);
    onColumnSelected(group, updatedColumnItem.id);
  };

  if (typeof selectedColumnItem === 'undefined') {
    return null;
  }

  const hasSingleElement = columnItems.length <= 1;

  return (
    <ColumnSelector
      hasSingleElement={hasSingleElement}
      columnItems={columnItems}
      selectedColumnItem={selectedColumnItem}
      handleColumnSelected={handleColumnSelected}
    />
  );
}

ColumnSelectorContainer.propTypes = {
  group: PropTypes.number,
  columns: PropTypes.array,
  selectedColumnsIds: PropTypes.array,
  onColumnSelected: PropTypes.func.isRequired
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ColumnSelectorContainer);
