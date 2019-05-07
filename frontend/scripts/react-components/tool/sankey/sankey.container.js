/* eslint-disable no-shadow */
import { connect } from 'react-redux';
import { mapToVanilla } from 'react-components/shared/vanilla-react-bridge.component';

import {
  selectNode,
  highlightNode,
  collapseNodeSelection,
  expandNodeSelection,
  resetState
} from 'actions/tool.actions';
import {
  getIsVisible,
  getIsReExpand,
  getHasExpandedNodesIds
} from 'react-components/tool/sankey/sankey.selectors';
import Sankey from 'react-components/tool/sankey/sankey.component';

const mapStateToProps = state => ({
  links: state.toolLinks.links,
  isVisible: getIsVisible(state),
  isReExpand: getIsReExpand(state),
  sankeySize: state.app.sankeySize,
  currentQuant: state.toolLinks.currentQuant,
  detailedView: state.toolLinks.detailedView,
  selectedNodesIds: state.toolLinks.selectedNodesIds,
  selectedRecolorBy: state.toolLinks.selectedRecolorBy,
  hasExpandedNodesIds: getHasExpandedNodesIds(state),
  highlightedNodesIds: state.toolLinks.highlightedNodesIds,
  visibleNodesByColumn: state.toolLinks.visibleNodesByColumn,
  nodesColoredAtColumn: state.toolLinks.nodesColoredAtColumn,
  lang: state.location.query && state.location.query.lang
});

const mapDispatchToProps = {
  onNodeClicked: selectNode,
  onNodeHighlighted: highlightNode,
  onExpandClick: expandNodeSelection,
  onCollapseClick: collapseNodeSelection,
  onClearClick: resetState
};

const methodProps = [
  {
    name: 'showLoadedLinks',
    compared: ['links'],
    returned: [
      'sankeySize',
      'selectedRecolorBy',
      'currentQuant',
      'selectedNodesIds',
      'links',
      'detailedView',
      'visibleNodesByColumn',
      'nodesColoredAtColumn'
    ]
  },
  {
    name: 'resizeViewport',
    compared: ['sankeySize'],
    returned: ['sankeySize', 'selectedRecolorBy', 'currentQuant', 'selectedNodesIds']
  },
  {
    name: 'selectNodes',
    compared: ['selectedNodesIds'],
    returned: ['selectedNodesIds']
  },
  {
    name: 'toggleExpandActionButton',
    compared: ['isVisible', 'isReExpand'],
    returned: ['isVisible', 'isReExpand']
  },
  {
    name: 'toggleCollapseActionButton',
    compared: ['hasExpandedNodesIds'],
    returned: ['hasExpandedNodesIds']
  },
  {
    name: 'highlightNodes',
    compared: ['highlightedNodesIds'],
    returned: ['highlightedNodesIds']
  },
  {
    name: 'translateNodes',
    compared: ['lang'],
    returned: ['currentQuant', 'selectedRecolorBy', 'selectedNodesIds']
  }
];

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(mapToVanilla(Sankey, methodProps, Object.keys(mapDispatchToProps)));
