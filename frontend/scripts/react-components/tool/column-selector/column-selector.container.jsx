import React, { useMemo } from 'react';
import { connect } from 'react-redux';
import { selectColumn } from 'actions/tool.actions';
import ColumnSelector from 'react-components/tool/column-selector/column-selector.component';
import PropTypes from 'prop-types';

const mapStateToProps = state => ({
  allColumns: state.tool.columns,
  currentDropdown: state.app.currentDropdown,
  selectedColumnsIds: state.tool.selectedColumnsIds
});

const mapDispatchToProps = dispatch => ({
  onColumnSelected: (columnIndex, columnId) => {
    dispatch(selectColumn(columnIndex, columnId));
  }
});

function ColumnSelectorContainer({ allColumns, group, selectedColumnsIds, onColumnSelected }) {
  const columnItems = useMemo(() => allColumns.filter(column => column.group === group), [
    allColumns,
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
  allColumns: PropTypes.array,
  selectedColumnsIds: PropTypes.array,
  onColumnSelected: PropTypes.func.isRequired
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ColumnSelectorContainer);
