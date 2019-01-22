import { connect } from 'react-redux';
import { mapToVanilla } from 'react-components/shared/vanilla-react-bridge.component';
import MapLegend from 'react-components/tool/map-legend/map-legend.component';
import { getCurrentHighlightedChoroplethBucket } from 'react-components/tool/tool.selectors';
import { toggleMapLayerMenu } from 'actions/app.actions';

const mapStateToProps = state => ({
  choroplethLegend: state.tool.choroplethLegend,
  selectedMapDimensionsWarnings: state.tool.selectedMapDimensionsWarnings,
  selectedMapContextualLayersData: state.tool.selectedMapContextualLayersData,
  currentHighlightedChoroplethBucket: getCurrentHighlightedChoroplethBucket(state.tool)
});

const mapDispatchToProps = {
  onToggleMapLayerMenu: toggleMapLayerMenu
};

const methodProps = [
  {
    name: 'updateChoroplethLegend',
    compared: ['choroplethLegend'],
    returned: ['choroplethLegend', 'selectedMapContextualLayersData']
  },
  {
    name: 'updateContextLegend',
    compared: ['selectedMapContextualLayersData'],
    returned: ['choroplethLegend', 'selectedMapContextualLayersData']
  },
  {
    name: 'highlightChoroplethBucket',
    compared: ['currentHighlightedChoroplethBucket'],
    returned: ['currentHighlightedChoroplethBucket']
  },
  {
    name: 'selectMapDimensions',
    compared: ['selectedMapDimensionsWarnings'],
    returned: ['selectedMapDimensionsWarnings']
  }
];

const callbackProps = ['onToggleMapLayerMenu'];

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(mapToVanilla(MapLegend, methodProps, callbackProps));
