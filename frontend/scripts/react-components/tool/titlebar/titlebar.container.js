import { connect } from 'react-redux';
import { mapToVanilla } from 'react-components/shared/vanilla-react-bridge.component';
import Titlebar from 'react-components/tool/titlebar/titlebar.component';
import {
  getSelectedNodesData,
  getHighlightedNodesData
} from 'react-components/tool/tool.selectors';

const mapStateToProps = state => {
  const highlightedNodeData = getHighlightedNodesData(state.tool);
  const selectedNodesData = getSelectedNodesData(state.tool);
  return {
    selectedNodesData,
    highlightedNodeData,
    showTitles:
      selectedNodesData.length > 0 ||
      (!state.tool.highlightedNodeCoordinates && highlightedNodeData.length > 0)
  };
};

const methodProps = [
  { name: 'selectNodes', compared: ['selectedNodesData'], returned: ['selectedNodesData'] },
  { name: 'highlightNode', compared: ['highlightedNodeData'], returned: ['showTitles'] }
];

export default connect(
  mapStateToProps,
  null
)(mapToVanilla(Titlebar, methodProps, []));
