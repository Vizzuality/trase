/* eslint-disable no-shadow */
import connect from 'connect';
import Titlebar from 'components/tool/titlebar.component';
import { getSelectedNodesData } from 'react-components/tool/tool.selectors';

// this maps component methods to app state updates
// keys correspond to method names, values to state prop path
const mapMethodsToState = state => ({
  selectNodes: getSelectedNodesData(state.tool),
  highlightNode: {
    _comparedValue: state => state.tool.highlightedNodeData,
    _returnedValue: state =>
      getSelectedNodesData(state.tool).length > 0 ||
      (!state.tool.highlightedNodeCoordinates && state.tool.highlightedNodeData.length > 0)
  }
});

export default connect(Titlebar, mapMethodsToState);
