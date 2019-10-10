import { connect } from 'react-redux';
import {
  getChoroplethOptions,
  getCurrentHighlightedChoroplethBucket,
  getSelectedMapContextualLayersData
} from 'react-components/tool-layers/tool-layers.selectors';
import { toggleMapLayerMenu } from 'actions/app.actions';
import { TOOL_LAYOUT } from 'constants';
import Legend from './legend.component';

const mapStateToProps = state => {
  const { choroplethLegend } = getChoroplethOptions(state);
  return {
    isHidden: state.toolLayers.toolLayout === TOOL_LAYOUT.right,
    choroplethLegend,
    contextualLayers: getSelectedMapContextualLayersData(state),
    highlightedChoroplethBucket: getCurrentHighlightedChoroplethBucket(state)
  };
};

const mapDispatchToProps = { toggleMapLayerMenu };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Legend);
