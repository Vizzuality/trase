/* eslint-disable no-shadow */
import { selectNode, navigateToProfile, resetState } from 'actions/tool.actions';
import connect from 'connect';
import NodesTitles from 'components/tool/nodesTitles.component';
import { getSelectedNodesData } from 'react-components/tool/tool.selectors';

// this maps component methods to app state updates
// keys correspond to method names, values to state prop path
const mapMethodsToState = () => ({
  selectNodes: {
    _comparedValue: state => getSelectedNodesData(state.tool),
    _returnedValue: state => ({
      nodesData: getSelectedNodesData(state.tool),
      recolorGroups: state.tool.recolorGroups,
      currentQuant: state.tool.currentQuant,
      selectedYears: state.tool.selectedYears
    })
  },
  highlightNode: {
    _comparedValue: state => state.tool.highlightedNodeData,
    _returnedValue: state => ({
      nodesData:
        state.tool.highlightedNodeData.length === 0
          ? getSelectedNodesData(state.tool)
          : state.tool.highlightedNodeData,
      isHighlight: state.tool.highlightedNodeData.length > 0,
      recolorGroups: state.tool.recolorGroups,
      coordinates: state.tool.highlightedNodeCoordinates,
      currentQuant: state.tool.currentQuant,
      selectedYears: state.tool.selectedYears
    })
  }
});

const mapViewCallbacksToActions = () => ({
  onCloseNodeClicked: id => selectNode(id),
  onProfileLinkClicked: (id, year) => navigateToProfile(id, year),
  onClearClick: () => resetState()
});

export default connect(NodesTitles, mapMethodsToState, mapViewCallbacksToActions);
