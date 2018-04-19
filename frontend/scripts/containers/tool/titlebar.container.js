/* eslint-disable no-shadow */
import connect from 'connect';
import Titlebar from 'components/tool/titlebar.component';

// this maps component methods to app state updates
// keys correspond to method names, values to state prop path
const mapMethodsToState = state => ({
  selectNodes: state.tool.selectedNodesData,
  highlightNode: {
    _comparedValue: state => state.tool.highlightedNodeData,
    _returnedValue: state =>
      state.tool.selectedNodesData.length > 0 ||
      (!state.tool.highlightedNodeCoordinates && state.tool.highlightedNodeData.length > 0)
  }
});

export default connect(Titlebar, mapMethodsToState);
