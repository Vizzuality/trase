/* eslint-disable no-shadow */
import connect from 'base/connect';
import { selectContextualLayers } from 'actions/tool.actions';
import mapContext from 'components/tool/map-context.component';
import { loadTooltip } from 'actions/app.actions';

const mapMethodsToState = state => ({
  buildLayers: {
    _comparedValue: state => state.tool.mapContextualLayers,
    _returnedValue: state => ({
      layers: state.tool.mapContextualLayers,
      selectedMapContextualLayers: state.tool.selectedMapContextualLayers
    })
  },
  selectContextualLayers: state.tool.selectedMapContextualLayers
});

const mapViewCallbacksToActions = () => ({
  onMapDimensionsLoaded: () => loadTooltip(),
  onContextualLayerSelected: layers => selectContextualLayers(layers)
});

export default connect(
  mapContext,
  mapMethodsToState,
  mapViewCallbacksToActions
);
