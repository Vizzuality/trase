import {
  getMergedLinks,
  getNodesColored,
  getSelectedRecolorBy,
  getSelectedResizeBy,
  getVisibleNodesByColumn
} from 'react-components/tool-links/tool-links.selectors';
import {
  getHasExpandedNodesIds,
  getIsReExpand,
  getIsVisible
} from 'react-components/tool/sankey/sankey.selectors';
import { connect } from 'react-redux';
import NewSankey from 'react-components/tool/new-sankey/new-sankey.component';
import {
  clearSankey,
  collapseSankey,
  expandSankey,
  highlightNode,
  selectNodes
} from 'react-components/tool-links/tool-links.actions';

const mapStateToProps = state => ({
  links: getMergedLinks(state),
  isVisible: getIsVisible(state),
  isReExpand: getIsReExpand(state),
  sankeySize: state.app.sankeySize,
  selectedResizeBy: getSelectedResizeBy(state),
  detailedView: state.toolLinks.detailedView,
  nodeHeights: state.toolLinks.data.nodeHeights,
  selectedNodesIds: state.toolLinks.selectedNodesIds,
  selectedRecolorBy: getSelectedRecolorBy(state),
  hasExpandedNodesIds: getHasExpandedNodesIds(state),
  highlightedNodeId: state.toolLinks.highlightedNodeId,
  visibleNodesByColumn: getVisibleNodesByColumn(state),
  nodesColoredAtColumn: getNodesColored(state).nodesColoredAtColumn,
  lang: state.location.query && state.location.query.lang
});

const mapDispatchToProps = {
  onNodeClicked: selectNodes,
  onNodeHighlighted: highlightNode,
  onExpandClick: expandSankey,
  onCollapseClick: collapseSankey,
  onClearClick: clearSankey
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NewSankey);
