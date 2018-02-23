/* eslint-disable no-shadow */
import connect from 'connect';
import MapDimensions from 'components/tool/map-dimensions.component';
import { toggleMapSidebarGroup, toggleMapDimension } from 'actions/tool.actions';
import { loadTooltip } from 'actions/app.actions';

const mapMethodsToState = state => ({
  loadMapDimensions: {
    _comparedValue: state => state.tool.mapDimensionsGroups,
    _returnedValue: state => ({
      mapDimensionsGroups: state.tool.mapDimensionsGroups,
      expandedMapSidebarGroupsIds: state.tool.expandedMapSidebarGroupsIds
    })
  },
  selectMapDimensions: state.tool.selectedMapDimensions,
  toggleSidebarGroups: state.tool.expandedMapSidebarGroupsIds,
  setVisibility: {
    _comparedValue: state => state.tool.selectedColumnsIds,
    _returnedValue: state => {
      const firstColumnId = state.tool.selectedColumnsIds[0];
      const column = state.tool.columns.find(c => c.id === firstColumnId);

      return column ? !column.isChoroplethDisabled : true;
    }
  }
});

const mapViewCallbacksToActions = () => ({
  onMapDimensionsLoaded: () => loadTooltip(),
  onToggleGroup: id => toggleMapSidebarGroup(id),
  onDimensionClick: uid => toggleMapDimension(uid)
});

export default connect(MapDimensions, mapMethodsToState, mapViewCallbacksToActions);
