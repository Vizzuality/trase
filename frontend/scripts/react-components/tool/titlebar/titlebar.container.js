import { connect } from 'react-redux';
import Titlebar from 'react-components/tool/titlebar/titlebar.component';
import {
  getSelectedNodesData,
  getHighlightedNodesData
} from 'react-components/tool/tool.selectors';

const mapStateToProps = state => {
  const highlightedNodesData = getHighlightedNodesData(state);
  const selectedNodesData = getSelectedNodesData(state);
  return {
    showTitles:
      selectedNodesData.length > 0 ||
      (!state.toolLayers.highlightedNodeCoordinates && highlightedNodesData.length > 0)
  };
};

export default connect(
  mapStateToProps,
  null
)(Titlebar);
