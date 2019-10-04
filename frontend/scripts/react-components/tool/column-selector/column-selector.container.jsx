import React, { useMemo } from 'react';
import { connect } from 'react-redux';
import { selectColumn } from 'react-components/tool-links/tool-links.actions';
import ColumnSelector from 'react-components/tool/column-selector/column-selector.component';
import PropTypes from 'prop-types';
import { getSelectedColumnsIds } from 'react-components/tool/tool.selectors';
import { getGapBetweenColumns } from 'react-components/tool/sankey/sankey.selectors';

const mapStateToProps = state => ({
  sankeyColumnsWidth: state.toolLinks.sankeyColumnsWidth,
  gapBetweenColumns: getGapBetweenColumns(state),
  columns: Object.values(state.app.data.columns || {}),
  selectedColumnsIds: getSelectedColumnsIds(state),
  nodesColoredAtColumn: state.toolLinks.nodesColoredAtColumn
});

const mapDispatchToProps = {
  onColumnSelected: selectColumn
};

function ColumnSelectorContainer({
  columns,
  group,
  selectedColumnsIds,
  onColumnSelected,
  gapBetweenColumns,
  sankeyColumnsWidth
}) {
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
      group={group}
      sankeyColumnsWidth={sankeyColumnsWidth}
      gapBetweenColumns={gapBetweenColumns}
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
  sankeyColumnsWidth: PropTypes.number,
  gapBetweenColumns: PropTypes.number,
  selectedColumnsIds: PropTypes.array,
  onColumnSelected: PropTypes.func.isRequired
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ColumnSelectorContainer);
