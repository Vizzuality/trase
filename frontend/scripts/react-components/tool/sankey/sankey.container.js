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
  links: state.tool.links,
  isVisible: getIsVisible(state),
  isReExpand: getIsReExpand(state),
  sankeySize: state.app.sankeySize,
  currentQuant: state.tool.currentQuant,
  detailedView: state.tool.detailedView,
  selectedNodesIds: state.tool.selectedNodesIds,
  selectedRecolorBy: state.tool.selectedRecolorBy,
  hasExpandedNodesIds: getHasExpandedNodesIds(state),
  highlightedNodesIds: state.tool.highlightedNodesIds,
  visibleNodesByColumn: state.tool.visibleNodesByColumn,
  nodesColoredAtColumn: state.tool.nodesColoredAtColumn,
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

const callbackProps = [
  'onNodeClicked',
  'onNodeHighlighted',
  'onExpandClick',
  'onCollapseClick',
  'onClearClick'
];

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(mapToVanilla(Sankey, methodProps, callbackProps));
