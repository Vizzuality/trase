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
import {
  getVisibleNodesByColumn,
  getMergedLinks,
  getNodesColored,
  getSelectedRecolorBy
} from 'react-components/tool/tool.selectors';
import Sankey from 'react-components/tool/sankey/sankey.component';

const mapStateToProps = state => ({
  links: getMergedLinks(state),
  isVisible: getIsVisible(state),
  isReExpand: getIsReExpand(state),
  sankeySize: state.app.sankeySize,
  currentQuant: state.toolLinks.currentQuant,
  detailedView: state.toolLinks.detailedView,
  selectedNodesIds: state.toolLinks.selectedNodesIds,
  selectedRecolorBy: getSelectedRecolorBy(state),
  hasExpandedNodesIds: getHasExpandedNodesIds(state),
  highlightedNodesIds: state.toolLinks.highlightedNodesIds,
  visibleNodesByColumn: getVisibleNodesByColumn(state),
  nodesColoredAtColumn: getNodesColored(state).nodesColoredAtColumn,
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
