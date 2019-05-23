import { connect } from 'react-redux';
import { mapToVanilla } from 'react-components/shared/vanilla-react-bridge.component';
import { selectNode, navigateToProfile, resetState } from 'actions/tool.actions';
import NodesTitles from 'react-components/tool/nodes-titles/nodes-titles.component';
import {
  getSelectedResizeBy,
  getSelectedMapDimensions,
  getToolRecolorGroups,
  getSelectedNodesData,
  getHighlightedNodesData
} from 'react-components/tool/tool.selectors';

const mapStateToProps = state => ({
  selectedResizeBy: getSelectedResizeBy(state),
  selectedMapDimensions: getSelectedMapDimensions(state),
  selectedNodesData: getSelectedNodesData(state),
  columns: state.toolLinks.data.columns,
  attributes: state.toolLinks.data.nodeAttributes,
  recolorGroups: getToolRecolorGroups(state),
  currentQuant: state.toolLinks.currentQuant,
  selectedYears: state.app.selectedYears,
  selectedContextId: state.app.selectedContext ? state.app.selectedContext.id : null,
  highlightedNodesData: getHighlightedNodesData(state),
  coordinates: state.toolLayers.highlightedNodeCoordinates
});

const methodProps = [
  {
    name: 'selectNodes',
    compared: ['selectedNodesData'],
    returned: [
      'selectedResizeBy',
      'attributes',
      'selectedMapDimensions',
      'selectedNodesData',
      'recolorGroups',
      'currentQuant',
      'selectedYears',
      'selectedContextId',
      'columns',
      'attributes'
    ]
  },
  {
    name: 'highlightNode',
    compared: ['highlightedNodesData'],
    returned: [
      'selectedResizeBy',
      'columns',
      'selectedMapDimensions',
      'highlightedNodesData',
      'recolorGroups',
      'coordinates',
      'currentQuant',
      'selectedYears',
      'attributes',
      'selectedContextId',
      'selectedNodesData'
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
