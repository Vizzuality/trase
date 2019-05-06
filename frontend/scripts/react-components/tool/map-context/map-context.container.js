/* eslint-disable no-shadow */
import { connect } from 'react-redux';
import { selectContextualLayers } from 'actions/tool.actions';
import MapContext from 'react-components/tool/map-context/map-context.component';
import { loadTooltip } from 'actions/app.actions';
import { mapToVanilla } from 'react-components/shared/vanilla-react-bridge.component';

const mapStateToProps = state => ({
  layers: state.tool.mapContextualLayers,
  selectedMapContextualLayers: state.tool.selectedMapContextualLayers
});

const methodProps = [
  { name: 'buildLayers', compared: ['layers'], returned: ['layers', 'selectedMapContextualLayers'] }
];

const mapDispatchToProps = {
  onMapDimensionsLoaded: () => loadTooltip(),
  onContextualLayerSelected: layers => selectContextualLayers(layers)
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(mapToVanilla(MapContext, methodProps, Object.keys(mapDispatchToProps)));
