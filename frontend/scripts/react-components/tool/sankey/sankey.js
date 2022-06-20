import {
  getSelectedRecolorBy,
  getSelectedResizeBy
} from 'react-components/tool-links/tool-links.selectors';
import { getHasExtraColumn } from 'react-components/tool/tool.selectors';
import {
  getSankeyMaxHeight,
  getHasExpandedNodesIds,
  getIsReExpand,
  getSankeyColumns,
  getSankeyLinks,
  getGapBetweenColumns,
  getLastSelectedNodeLink,
  getToolColumns
} from 'react-components/tool/sankey/sankey.selectors';
import { getSelectedContext } from 'app/app.selectors';
import { connect } from 'react-redux';
import Sankey from 'react-components/tool/sankey/sankey.component';
import { toolLinksActions } from 'react-components/tool-links/tool-links.register';
import { getSelectedMapDimensionsData } from 'react-components/tool-layers/tool-layers.selectors';

// Links and Nodes flow
// Links in the sankey are requested on the getToolLinksData fetch saga (flows endpoint)
// The links are filtered by the selected node which is imported as an expanded node from the nodesPanel (see getExpandedAndExcludedNodes in nodes-panel.selectors)
// This links contain the nodes on their path attribute and we fetch these nodes information afterwards to be able to show it (getToolNodesByLink)

const mapStateToProps = state => ({
  links: getSankeyLinks(state),
  toolColumns: getToolColumns(state),
  columns: getSankeyColumns(state),
  isReExpand: getIsReExpand(state),
  sankeySize: state.toolLayers.sankeySize,
  maxHeight: getSankeyMaxHeight(state),
  nodeHeights: state.toolLinks.data.nodeHeights,
  otherNodes: state.toolLinks.data.otherNodes,
  nodeAttributes: state.toolLinks.data.nodeAttributes,
  sankeyColumnsWidth: state.toolLinks.sankeyColumnsWidth,
  selectedResizeBy: getSelectedResizeBy(state),
  detailedView: state.toolLinks.detailedView,
  selectedNodesIds: state.toolLinks.selectedNodesIds,
  selectedRecolorBy: getSelectedRecolorBy(state),
  hasExpandedNodesIds: getHasExpandedNodesIds(state),
  gapBetweenColumns: getGapBetweenColumns(state),
  flowsLoading: state.toolLinks.flowsLoading,
  lastSelectedNodeLink: getLastSelectedNodeLink(state),
  highlightedNodeId: state.toolLinks.highlightedNodeId,
  selectedMapDimensions: getSelectedMapDimensionsData(state),
  toolLayout: state.toolLayers.toolLayout,
  extraColumnId: (getHasExtraColumn(state) && state.toolLinks.extraColumn?.id) || null,
  extraColumnNodeId: state.toolLinks.extraColumnNodeId,
  selectedContext: getSelectedContext(state)
});

const mapDispatchToProps = {
  goToProfile: toolLinksActions.goToProfileFromSankey,
  onNodeClicked: toolLinksActions.selectNodes,
  onNodeHighlighted: toolLinksActions.highlightNode,
  onExpandClick: toolLinksActions.expandSankey,
  onChangeExtraColumn: toolLinksActions.changeExtraColumn,
  onCollapseClick: toolLinksActions.collapseSankey
};

export default connect(mapStateToProps, mapDispatchToProps)(Sankey);
