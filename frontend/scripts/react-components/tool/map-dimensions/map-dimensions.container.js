import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import MapDimensions from 'react-components/tool/map-dimensions/map-dimensions.component';
import { toggleMapDimension } from 'actions/tool.actions';
import { loadTooltip } from 'actions/app.actions';
import { mapToVanilla } from 'react-components/shared/vanilla-react-bridge.component';

// There's an update infinite loop inside loadMapDimensions, so mapDimensionsGroups should always be memoized
const getLegacyMapDimensionsGroups = createSelector(
  [state => state.toolLayers.mapDimensionsGroups, state => state.toolLayers.mapDimensions],
  (groups, mapDimensions) =>
    groups.map(mapDimensionGroup => {
      const { dimensions, ...group } = mapDimensionGroup;
      return { group, dimensions: dimensions.map(uid => mapDimensions[uid]) };
    })
);

const isCloroplethEnabled = state => {
  const firstColumnId = state.toolLinks.selectedColumnsIds[0];
  const column = state.toolLinks.columns.find(c => c.id === firstColumnId);
  return column ? !column.isChoroplethDisabled : true;
};
const mapStateToProps = state => ({
  mapDimensionsGroups: getLegacyMapDimensionsGroups(state),
  selectedMapDimensions: state.toolLayers.selectedMapDimensions,
  isCloroplethEnabled: isCloroplethEnabled(state),
  selectedColumnsIds: state.toolLinks.selectedColumnsIds
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
  onDimensionClick: uid => toggleMapDimension(uid)
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(mapToVanilla(MapDimensions, methodProps, [...Object.keys(mapDispatchToProps), 'onToggleGroup']));
