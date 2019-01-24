/* eslint-disable no-shadow */
import { selectNode, navigateToProfile, resetState } from 'actions/tool.actions';
import connect from 'connect';
import NodesTitles from 'components/tool/nodesTitles.component';
import {
  getSelectedNodesData,
  getHighlightedNodesData
} from 'react-components/tool/tool.selectors';

// this maps component methods to app state updates
// keys correspond to method names, values to state prop path
const mapMethodsToState = () => ({
  selectNodes: {
    _comparedValue: state => getSelectedNodesData(state.tool),
    _returnedValue: state => ({
      nodesData: getSelectedNodesData(state.tool),
      recolorGroups: state.tool.recolorGroups,
      currentQuant: state.tool.currentQuant,
      selectedYears: state.app.selectedYears,
      selectedContextId: state.app.selectedContext ? state.app.selectedContext.id : null
    })
  },
  highlightNode: {
    _comparedValue: state => getHighlightedNodesData(state.tool),
    _returnedValue: state => {
      const highlightedNodesData = getHighlightedNodesData(state.tool);

      return {
        nodesData:
          highlightedNodesData.length === 0
            ? getSelectedNodesData(state.tool)
            : highlightedNodesData,
        isHighlight: highlightedNodesData.length > 0,
        recolorGroups: state.tool.recolorGroups,
        coordinates: state.tool.highlightedNodeCoordinates,
        currentQuant: state.tool.currentQuant,
        selectedYears: state.app.selectedYears,
        selectedContextId: state.app.selectedContext ? state.app.selectedContext.id : null
      };
    }
  }
});

const mapViewCallbacksToActions = () => ({
  onCloseNodeClicked: id => selectNode(id),
  onProfileLinkClicked: (id, year, contextId) => navigateToProfile(id, year, contextId),
  onClearClick: () => resetState()
});

export default connect(
  NodesTitles,
  mapMethodsToState,
  mapViewCallbacksToActions
);
