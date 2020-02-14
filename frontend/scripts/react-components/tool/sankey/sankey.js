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
import { connect } from 'react-redux';
import Sankey from 'react-components/tool/sankey/sankey.component';
import {
  clearSankey,
  collapseSankey,
  expandSankey,
  highlightNode,
  selectNodes,
  goToProfileFromSankey,
  changeExtraColumn
} from 'react-components/tool-links/tool-links.register';
import { getSelectedMapDimensionsData } from 'react-components/tool-layers/tool-layers.selectors';

const mapStateToProps = state => ({
  links: getSankeyLinks(state),
  toolColumns: getToolColumns(state),
  columns: getSankeyColumns(state),
  isReExpand: getIsReExpand(state),
  sankeySize: state.toolLayers.sankeySize,
  maxHeight: getSankeyMaxHeight(state),
  nodeHeights: state.toolLinks.data.nodeHeights,
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
  extraColumnNodeId: state.toolLinks.extraColumnNodeId
});

const mapDispatchToProps = {
  goToProfile: goToProfileFromSankey,
  onNodeClicked: selectNodes,
  onNodeHighlighted: highlightNode,
  onExpandClick: expandSankey,
  onChangeExtraColumn: changeExtraColumn,
  onCollapseClick: collapseSankey,
  onClearClick: clearSankey
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Sankey);
