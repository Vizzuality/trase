/* eslint-disable no-shadow */
import { connect } from 'react-redux';
import { selectContextualLayers } from 'react-components/tool/tool.actions';
import MapContext from 'react-components/tool/map-context/map-context.component';
import { loadTooltip } from 'app/app.actions';
import { mapToVanilla } from 'react-components/shared/vanilla-react-bridge.component';

const mapStateToProps = state => ({
  layers: state.toolLayers.data.mapContextualLayers,
  selectedMapContextualLayers: state.toolLayers.selectedMapContextualLayers
});

const methodProps = [
  {
    name: 'buildLayers',
    compared: ['layers'],
    returned: ['layers', 'selectedMapContextualLayers']
  },
  {
    name: 'selectContextualLayers',
    compared: ['selectedMapContextualLayers'],
    returned: ['selectedMapContextualLayers']
  }
];

const mapDispatchToProps = {
  onMapDimensionsLoaded: () => loadTooltip(),
  onContextualLayerSelected: layers => selectContextualLayers(layers)
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(mapToVanilla(MapContext, methodProps, Object.keys(mapDispatchToProps)));
