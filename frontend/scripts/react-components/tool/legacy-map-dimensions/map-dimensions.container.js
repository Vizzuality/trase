import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import MapDimensions from 'react-components/tool/legacy-map-dimensions/map-dimensions.component';
import { toggleMapDimension } from 'react-components/tool/tool.actions';
import { loadTooltip } from 'actions/app.actions';
import { mapToVanilla } from 'react-components/shared/vanilla-react-bridge.component';
import { getSelectedColumnsIds } from 'react-components/tool/tool.selectors';
import { getSelectedMapDimensionsUids } from 'react-components/tool-layers/tool-layers.selectors';

// There's an update infinite loop inside loadMapDimensions, so mapDimensionsGroups should always be memoized
const getLegacyMapDimensionsGroups = createSelector(
  [
    state => state.toolLayers.data.mapDimensionsGroups,
    state => state.toolLayers.data.mapDimensions
  ],
  (groups, mapDimensions) =>
    groups.map(mapDimensionGroup => {
      const { dimensions, ...group } = mapDimensionGroup;
      return {
        group,
        dimensions: dimensions.map(uid => mapDimensions[uid])
      };
    })
);

const isCloroplethEnabled = state => {
  const selectedColumnsIds = getSelectedColumnsIds(state);
  const firstColumnId = selectedColumnsIds[0];
  const column = state.toolLinks.data.columns && state.toolLinks.data.columns[firstColumnId];
  return column ? !column.isChoroplethDisabled : true;
};
const mapStateToProps = state => ({
  mapDimensionsGroups: getLegacyMapDimensionsGroups(state),
  selectedMapDimensions: getSelectedMapDimensionsUids(state),
  isChoroplethEnabled: isCloroplethEnabled(state),
  selectedColumnsIds: getSelectedColumnsIds(state)
});

const methodProps = [
  {
    name: 'loadMapDimensions',
    compared: ['mapDimensionsGroups'],
    returned: ['mapDimensionsGroups', 'expandedMapSidebarGroupsIds']
  },
  {
    name: 'setMapDimensions',
    compared: ['selectedMapDimensions', 'mapDimensionsGroups'],
    returned: ['selectedMapDimensions']
  },
  {
    name: 'toggleSidebarGroups',
    compared: ['expandedMapSidebarGroupsIds'],
    returned: ['expandedMapSidebarGroupsIds']
  },
  {
    name: 'setVisibility',
    compared: ['isCloroplethEnabled'],
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
