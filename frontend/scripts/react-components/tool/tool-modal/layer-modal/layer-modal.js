import { connect } from 'react-redux';
import LayerModal from 'react-components/tool/tool-modal/layer-modal/layer-modal.component';
import { selectContextualLayers, toggleMapDimension } from 'react-components/tool/tool.actions';

// import { loadTooltip } from 'actions/app.actions';
import {
  getLayers,
  getSelectedLayers
} from 'react-components/tool/tool-modal/layer-modal/layer-modal.selectors';
import castArray from 'lodash/castArray';

const mapStateToProps = state => ({
  layers: getLayers(state),
  selectedItems: getSelectedLayers(state)
});

const mapDispatchToProps = {
  onChangeContexts: layers => selectContextualLayers(castArray(layers)),
  onToggleUnit: layer => toggleMapDimension(layer.uid)
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LayerModal);
