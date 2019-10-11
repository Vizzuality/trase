import { connect } from 'react-redux';
import {
  getChoroplethOptions,
  getCurrentHighlightedChoroplethBucket,
  getSelectedMapContextualLayersData
} from 'react-components/tool-layers/tool-layers.selectors';
import { hasLayers } from 'react-components/tool/legend/legend.selectors';
import { setActiveModal } from 'react-components/tool/tool.actions';
import { TOOL_LAYOUT } from 'constants';
import Legend from './legend.component';

const mapStateToProps = state => {
  const { choroplethLegend } = getChoroplethOptions(state);
  return {
    isHidden: state.toolLayers.toolLayout === TOOL_LAYOUT.right,
    choroplethLegend,
    hasLayers: hasLayers(state),
    contextualLayers: getSelectedMapContextualLayersData(state),
    highlightedChoroplethBucket: getCurrentHighlightedChoroplethBucket(state)
  };
};

const mapDispatchToProps = { openLayerModal: () => setActiveModal('layer') };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Legend);
