import React, { useMemo } from 'react';
import { connect } from 'react-redux';
import { selectColumn as selectColumnFn } from 'react-components/tool-links/tool-links.register';
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
  selectColumn: selectColumnFn
};

function ColumnSelectorContainer(props) {
  const {
    columns,
    group,
    position,
    selectColumn,
    gapBetweenColumns,
    sankeyColumnsWidth,
    selectedColumnId,
    hasExtraColumn
  } = props;
  const columnItems = useMemo(
    () =>
      hasExtraColumn
        ? columns.filter(column => column.id === selectedColumnId)
        : columns.filter(column => column.group === group),
    [columns, group, hasExtraColumn, selectedColumnId]
  );
  const selectedColumnItem = useMemo(
    () => columnItems.find(column => column.id === selectedColumnId),
    [columnItems, selectedColumnId]
  );

  const handleColumnSelected = ({ item }) => {
    const updatedColumnItem = columnItems.find(c => c.id === item.value);
    selectColumn(group, updatedColumnItem.id, updatedColumnItem.role);
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
  selectColumn: PropTypes.func.isRequired,
  hasExtraColumn: PropTypes.bool
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ColumnSelectorContainer);
