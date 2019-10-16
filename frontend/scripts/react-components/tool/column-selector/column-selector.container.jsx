import React, { useMemo } from 'react';
import { connect } from 'react-redux';
import { selectColumn } from 'react-components/tool-links/tool-links.actions';
import ColumnSelector from 'react-components/tool/column-selector/column-selector.component';
import PropTypes from 'prop-types';
import { getGapBetweenColumns } from 'react-components/tool/sankey/sankey.selectors';

const mapStateToProps = state => ({
  sankeyColumnsWidth: state.toolLinks.sankeyColumnsWidth,
  gapBetweenColumns: getGapBetweenColumns(state),
  columns: Object.values(state.toolLinks.data.columns || {}),
  nodesColoredAtColumn: state.toolLinks.nodesColoredAtColumn
});

const mapDispatchToProps = {
  onColumnSelected: selectColumn
};

function ColumnSelectorContainer({
  columns,
  group,
  position,
  onColumnSelected,
  gapBetweenColumns,
  sankeyColumnsWidth,
  selectedColumnId,
  isExtraColumn
}) {
  const columnItems = useMemo(
    () =>
      isExtraColumn
        ? columns.filter(column => column.id === selectedColumnId)
        : columns.filter(column => column.group === group),
    [columns, group, isExtraColumn, selectedColumnId]
  );
  const selectedColumnItem = useMemo(
    () => columnItems.find(column => column.id === selectedColumnId),
    [columnItems, selectedColumnId]
  );

  const handleColumnSelected = ({ item }) => {
    const updatedColumnItem = columnItems.find(c => c.id === item.value);
    onColumnSelected(group, updatedColumnItem.id);
  };

  if (typeof selectedColumnItem === 'undefined') {
    return null;
  }

  return (
    <ColumnSelector
      position={position}
      sankeyColumnsWidth={sankeyColumnsWidth}
      gapBetweenColumns={gapBetweenColumns}
      columnItems={columnItems}
      selectedColumnItem={selectedColumnItem}
      handleColumnSelected={handleColumnSelected}
    />
  );
}

ColumnSelectorContainer.propTypes = {
  position: PropTypes.number,
  group: PropTypes.number,
  columns: PropTypes.array,
  sankeyColumnsWidth: PropTypes.number,
  gapBetweenColumns: PropTypes.number,
  selectedColumnId: PropTypes.number,
  onColumnSelected: PropTypes.func.isRequired,
  isExtraColumn: PropTypes.bool
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ColumnSelectorContainer);
