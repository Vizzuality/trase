import { connect } from 'react-redux';
import LayerModal from 'react-components/tool/tool-modal/layer-modal/layer-modal.component';
import {
  selectContextualLayers,
  selectUnitLayers,
  setActiveModal
} from 'react-components/tool/tool.actions';
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
  setActiveModal
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LayerModal);
