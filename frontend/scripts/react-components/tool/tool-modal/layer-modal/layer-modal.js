import { connect } from 'react-redux';
import LayerModal from 'react-components/tool/tool-modal/layer-modal/layer-modal.component';
import {
  selectContextualLayers,
  selectUnitLayers,
  selectLogisticLayers
} from 'react-components/tool/tool.actions';
import { toolLayersActions } from 'react-components/tool-layers/tool-layers.register';
import {
  getLayers,
  getSelectedLayerIds
} from 'react-components/tool/tool-modal/layer-modal/layer-modal.selectors';

const mapStateToProps = state => ({
  layers: getLayers(state),
  selectedItemIds: getSelectedLayerIds(state)
});

const mapDispatchToProps = {
  selectUnitLayers,
  selectContextualLayers,
  selectLogisticLayers,
  setActiveModal: toolLayersActions.setActiveModal
};

export default connect(mapStateToProps, mapDispatchToProps)(LayerModal);
