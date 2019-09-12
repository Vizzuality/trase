import { connect } from 'react-redux';
import { mapToVanilla } from 'react-components/shared/vanilla-react-bridge.component';
import { navigateToProfile } from 'react-components/tool/tool.actions';
import { clearSankey, selectNodes } from 'react-components/tool-links/tool-links.actions';
import NodesTitles from 'react-components/tool/nodes-titles/nodes-titles.component';
import {
  getSelectedNodesData,
  getHighlightedNodesData
} from 'react-components/tool/tool.selectors';
import {
  getSelectedResizeBy,
  getToolRecolorGroups
} from 'react-components/tool-links/tool-links.selectors';
import { getSelectedMapDimensionsData } from 'react-components/tool-layers/tool-layers.selectors';
import { getSelectedContext, getSelectedYears } from 'reducers/app.selectors';

const mapStateToProps = state => {
  const selectedContext = getSelectedContext(state);
  const selectedYears = getSelectedYears(state);
  return {
    selectedYears,
    selectedResizeBy: getSelectedResizeBy(state),
    selectedMapDimensions: getSelectedMapDimensionsData(state),
    selectedNodesData: getSelectedNodesData(state),
    nodeHeights: state.toolLinks.data.nodeHeights,
    columns: state.toolLinks.data.columns,
    attributes: state.toolLinks.data.nodeAttributes,
    recolorGroups: getToolRecolorGroups(state),
    selectedContextId: selectedContext ? selectedContext.id : null,
    highlightedNodesData: getHighlightedNodesData(state),
    coordinates: state.toolLayers.highlightedNodeCoordinates
  };
};

const methodProps = [
  {
    name: 'selectNodes',
    compared: ['selectedNodesData', 'highlightedNodesData'],
    returned: [
      'highlightedNodesData',
      'nodeHeights',
      'selectedResizeBy',
      'attributes',
      'selectedMapDimensions',
      'selectedNodesData',
      'recolorGroups',
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
      'nodeHeights',
      'selectedResizeBy',
      'columns',
      'selectedMapDimensions',
      'highlightedNodesData',
      'recolorGroups',
      'coordinates',
      'selectedYears',
      'attributes',
      'selectedContextId',
      'selectedNodesData'
    ]
  }
];

const mapDispatchToProps = {
  onCloseNodeClicked: selectNodes,
  onProfileLinkClicked: navigateToProfile,
  onClearClick: clearSankey
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(mapToVanilla(NodesTitles, methodProps, Object.keys(mapDispatchToProps)));
