import { connect } from 'react-redux';
import { mapToVanilla } from 'react-components/shared/vanilla-react-bridge.component';
import Titlebar from 'react-components/tool/titlebar/titlebar.component';
import {
  getSelectedNodesData,
  getHighlightedNodesData
} from 'react-components/tool/tool.selectors';

const mapStateToProps = state => {
  const highlightedNodesData = getHighlightedNodesData(state);
  const selectedNodesData = getSelectedNodesData(state);
  return {
    selectedNodesData,
    showTitles:
      selectedNodesData.length > 0 ||
      (!state.toolLayers.highlightedNodeCoordinates && highlightedNodesData.length > 0)
  };
};

const methodProps = [
  { name: 'selectNodes', compared: ['selectedNodesData'], returned: ['selectedNodesData'] },
  { name: 'highlightNode', compared: ['highlightedNodesData'], returned: ['showTitles'] }
];

export default connect(
  mapStateToProps,
  null
)(mapToVanilla(Titlebar, methodProps, []));
