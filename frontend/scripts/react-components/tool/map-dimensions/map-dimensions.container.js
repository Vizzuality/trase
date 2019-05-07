import { connect } from 'react-redux';
import MapDimensions from 'react-components/tool/map-dimensions/map-dimensions.component';
import { toggleMapSidebarGroup, toggleMapDimension } from 'actions/tool.actions';
import { loadTooltip } from 'actions/app.actions';
import { mapToVanilla } from 'react-components/shared/vanilla-react-bridge.component';

const isCloroplethEnabled = state => {
  const firstColumnId = state.tool.selectedColumnsIds[0];
  const column = state.tool.columns.find(c => c.id === firstColumnId);
  return column ? !column.isChoroplethDisabled : true;
};
const mapStateToProps = state => ({
  mapDimensionsGroups: state.tool.mapDimensionsGroups,
  expandedMapSidebarGroupsIds: state.tool.expandedMapSidebarGroupsIds,
  selectedMapDimensions: state.tool.selectedMapDimensions,
  toggleSidebarGroups: state.tool.expandedMapSidebarGroupsIds,
  isCloroplethEnabled: isCloroplethEnabled(state),
  selectedColumnsIds: state.tool.selectedColumnsIds
});

const methodProps = [
  {
    name: 'loadMapDimensions',
    compared: ['mapDimensionsGroups'],
    returned: ['mapDimensionsGroups', 'expandedMapSidebarGroupsIds']
  },
  {
    name: 'selectMapDimensions',
    compared: ['selectedMapDimensions'],
    returned: ['selectedMapDimensions']
  },
  {
    name: 'toggleSidebarGroups',
    compared: ['expandedMapSidebarGroupsIds'],
    returned: ['expandedMapSidebarGroupsIds']
  },
  {
    name: 'setVisibility',
    compared: ['selectedColumnsIds'],
    returned: ['isCloroplethEnabled']
  }
];

const mapDispatchToProps = {
  onMapDimensionsLoaded: () => loadTooltip(),
  onToggleGroup: id => toggleMapSidebarGroup(id),
  onDimensionClick: uid => toggleMapDimension(uid)
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(mapToVanilla(MapDimensions, methodProps, Object.keys(mapDispatchToProps)));
