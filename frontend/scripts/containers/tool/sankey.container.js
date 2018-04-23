/* eslint-disable no-shadow */
import isEqual from 'lodash/isEqual';
import isEmpty from 'lodash/isEmpty';
import {
  selectNode,
  highlightNode,
  collapseNodeSelection,
  expandNodeSelection,
  resetState
} from 'actions/tool.actions';
import connect from 'connect';
import Sankey from 'components/tool/sankey.component';

let lastSelectedNodeId;

const shouldRepositionExpandButton = ({ selectedNodesIds }) => {
  const lastSelectedNodeChanged = selectedNodesIds[0] !== lastSelectedNodeId;
  lastSelectedNodeId = selectedNodesIds[0];

  return lastSelectedNodeChanged;
};

const canExpandSelection = ({ expandedNodesIds, selectedNodesIds }) =>
  !isEqual([...selectedNodesIds].sort(), [...expandedNodesIds].sort());

const anyOfConditionsDidChange = (...conditions) => conditions.map(c => (!!c).toString()).join('');

// this maps component methods to app state updates
// keys correspond to method names, values to state prop path
const mapMethodsToState = state => ({
  showLoadedLinks: {
    _comparedValue: state => state.tool.links,
    _returnedValue: state => ({
      sankeySize: state.app.sankeySize,
      selectedRecolorBy: state.tool.selectedRecolorBy,
      currentQuant: state.tool.currentQuant,
      selectedNodesIds: state.tool.selectedNodesIds,
      links: state.tool.links,
      detailedView: state.tool.detailedView,
      visibleNodesByColumn: state.tool.visibleNodesByColumn,
      nodesColoredAtColumn: state.tool.nodesColoredAtColumn,
      shouldRepositionExpandButton: shouldRepositionExpandButton(state.tool)
    })
  },
  resizeViewport: {
    _comparedValue: state => state.app.sankeySize,
    _returnedValue: state => ({
      sankeySize: state.app.sankeySize,
      selectedRecolorBy: state.tool.selectedRecolorBy,
      currentQuant: state.tool.currentQuant,
      selectedNodesIds: state.tool.selectedNodesIds,
      shouldRepositionExpandButton: shouldRepositionExpandButton(state.tool)
    })
  },
  selectNodes: {
    _comparedValue: state => state.tool.selectedNodesIds,
    _returnedValue: state => ({
      selectedNodesIds: state.tool.selectedNodesIds,
      shouldRepositionExpandButton: shouldRepositionExpandButton(state.tool)
    })
  },
  toggleExpandActionButton: {
    _comparedValue: state =>
      anyOfConditionsDidChange(
        canExpandSelection(state.tool),
        isEmpty(state.tool.expandedNodesIds)
      ),
    _returnedValue: state => ({
      isVisible: canExpandSelection(state.tool),
      isReExpand: !isEmpty(state.tool.expandedNodesIds) && canExpandSelection(state.tool)
    })
  },
  toggleCollapseActionButton: !isEmpty(state.tool.expandedNodesIds),
  highlightNodes: state.tool.highlightedNodesIds,
  translateNodes: {
    _comparedValue: state => state.location.query && state.location.query.lang,
    _returnedValue: state => ({
      selectedRecolorBy: state.tool.selectedRecolorBy,
      currentQuant: state.tool.currentQuant,
      selectedNodesIds: state.tool.selectedNodesIds,
      shouldRepositionExpandButton: shouldRepositionExpandButton(state.tool)
    })
  }
});

// maps component callbacks (ie user events) to redux actions
// in the component, call this.callbacks.someMethod
// and from here return an object with keys = callback name (someMethod),
// and values = functions returning an action
const mapViewCallbacksToActions = () => ({
  onNodeClicked: (id, isAggregated) => selectNode(id, isAggregated),
  onNodeHighlighted: (id, isAggregated) => highlightNode(id, isAggregated),
  onExpandClick: () => expandNodeSelection(),
  onCollapseClick: () => collapseNodeSelection(),
  onClearClick: () => resetState()
});

export default connect(Sankey, mapMethodsToState, mapViewCallbacksToActions);
