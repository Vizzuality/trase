import { connect } from 'react-redux';
import { mapToVanilla } from 'react-components/shared/vanilla-react-bridge.component';
import { selectNode, navigateToProfile, resetState } from 'actions/tool.actions';
import NodesTitles from 'react-components/tool/nodes-titles/nodes-titles.component';
import {
  getSelectedNodesData,
  getHighlightedNodesData
} from 'react-components/tool/tool.selectors';

const mapStateToProps = state => {
  const highlightedNodesData = getHighlightedNodesData(state);
  return {
    nodesData: getSelectedNodesData(state),
    recolorGroups: state.toolLinks.recolorGroups,
    currentQuant: state.toolLinks.currentQuant,
    selectedYears: state.app.selectedYears,
    selectedContextId: state.app.selectedContext ? state.app.selectedContext.id : null,
    highlightedNodesData:
      highlightedNodesData.length === 0 ? getSelectedNodesData(state) : highlightedNodesData,
    isHighlight: highlightedNodesData.length > 0,
    coordinates: state.toolLayers.highlightedNodeCoordinates
  };
};

const methodProps = [
  {
    name: 'selectNodes',
    compared: ['nodesData'],
    returned: ['nodesData', 'recolorGroups', 'currentQuant', 'selectedYears', 'selectedContextId']
  },
  {
    name: 'selectNodes',
    compared: ['highlightedNodesData'],
    returned: [
      'highlightedNodesData',
      'isHighlight',
      'recolorGroups',
      'coordinates',
      'currentQuant',
      'selectedYears',
      'selectedContextId'
    ]
  }
];

const mapDispatchToProps = {
  onCloseNodeClicked: id => selectNode(id),
  onProfileLinkClicked: (id, year, contextId) => navigateToProfile(id, year, contextId),
  onClearClick: () => resetState()
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(mapToVanilla(NodesTitles, methodProps, Object.keys(mapDispatchToProps)));
