/* eslint-disable no-shadow */
import connect from 'connect';
import { toggleMapLayerMenu } from 'actions/app.actions';
import MapLegend from 'components/tool/map-legend.component';
import { getCurrentHighlightedChoroplethBucket } from 'react-components/tool/tool.selectors';

const mapMethodsToState = state => ({
  updateChoroplethLegend: {
    _comparedValue: state => state.tool.choroplethLegend,
    _returnedValue: state => ({
      choroplethLegend: state.tool.choroplethLegend,
      selectedMapContextualLayersData: state.tool.selectedMapContextualLayersData
    })
  },
  updateContextLegend: {
    _comparedValue: state => state.tool.selectedMapContextualLayersData,
    _returnedValue: state => ({
      choroplethLegend: state.tool.choroplethLegend,
      selectedMapContextualLayersData: state.tool.selectedMapContextualLayersData
    })
  },
  highlightChoroplethBucket: getCurrentHighlightedChoroplethBucket(state.tool),
  selectMapDimensions: state.tool.selectedMapDimensionsWarnings
});

const mapViewCallbacksToActions = () => ({
  onToggleMapLayerMenu: () => toggleMapLayerMenu()
});

export default connect(
  MapLegend,
  mapMethodsToState,
  mapViewCallbacksToActions
);
