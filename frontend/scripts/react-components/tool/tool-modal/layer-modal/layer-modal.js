import { connect } from 'react-redux';
import LayerModal from 'react-components/tool/tool-modal/layer-modal/layer-modal.component';
import { selectContextualLayers } from 'react-components/tool/tool.actions';
import { loadTooltip } from 'actions/app.actions';
import {
  getLayers,
  getSelectedLayers
} from 'react-components/tool/tool-modal/layer-modal/layer-modal.selectors';

const mapStateToProps = state => ({
  layers: getLayers(state),
  selectedItems: getSelectedLayers(state)
});

const mapDispatchToProps = {
  onMapDimensionsLoaded: () => loadTooltip(),
  onContextualLayerSelected: layers => selectContextualLayers(layers),
  onChange: layers => console.log(layers)
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LayerModal);
