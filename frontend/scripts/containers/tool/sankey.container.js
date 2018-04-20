/* eslint-disable no-shadow */
import isEqual from 'lodash/isEqual';
import {
  selectNode,
  highlightNode,
  toggleNodesExpand,
  reExpandNodes,
  resetState
} from 'actions/tool.actions';
import connect from 'connect';
import Sankey from 'components/tool/sankey.component';

const shouldRepositionExpandButton = ({ expandedNodesIds, selectedNodesIds, areNodesExpanded }) =>
  areNodesExpanded === false ||
  expandedNodesIds === undefined ||
  expandedNodesIds.slice().sort()[0] === selectedNodesIds.slice().sort()[0];

const canReExpandSelection = ({ expandedNodesIds, selectedNodesIds, areNodesExpanded }) =>
  areNodesExpanded && !isEqual([...selectedNodesIds].sort(), [...expandedNodesIds].sort());

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
      shouldRepositionExpandButton: shouldRepositionExpandButton(state.tool),
      canReExpandSelection: canReExpandSelection(state.tool)
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
      shouldRepositionExpandButton: shouldRepositionExpandButton(
        state.tool.expandedNodesIds,
        state.tool.selectedNodesIds,
        state.tool.areNodesExpanded
      ),
      canReExpandSelection: canReExpandSelection(state.tool)
    })
  },
  toggleExpandButton: state.tool.areNodesExpanded,
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
  onExpandClick: () => toggleNodesExpand(),
  onReExpandClick: () => reExpandNodes(),
  onClearClick: () => resetState()
});

export default connect(Sankey, mapMethodsToState, mapViewCallbacksToActions);
