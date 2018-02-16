/* eslint-disable no-shadow */
import { selectNode, highlightNode, toggleNodesExpand, resetState } from 'actions/tool.actions';
import connect from 'connect';
import Sankey from 'components/tool/sankey.component';

const shouldRepositionExpandButton = (expandedNodesIds, selectedNodesIds, areNodesExpanded) =>
  areNodesExpanded === false ||
  expandedNodesIds === undefined ||
  expandedNodesIds[0] === selectedNodesIds[0];

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
      shouldRepositionExpandButton: shouldRepositionExpandButton(
        state.tool.expandedNodesIds,
        state.tool.selectedNodesIds,
        state.tool.areNodesExpanded
      )
    })
  },
  resizeViewport: {
    _comparedValue: state => state.app.sankeySize,
    _returnedValue: state => ({
      sankeySize: state.app.sankeySize,
      selectedRecolorBy: state.tool.selectedRecolorBy,
      currentQuant: state.tool.currentQuant,
      selectedNodesIds: state.tool.selectedNodesIds,
      shouldRepositionExpandButton: shouldRepositionExpandButton(
        state.tool.expandedNodesIds,
        state.tool.selectedNodesIds,
        state.tool.areNodesExpanded
      ),
      lang: state.location.query && state.location.query.lang
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
      )
    })
  },
  toggleExpandButton: state.tool.areNodesExpanded,
  highlightNodes: state.tool.highlightedNodesIds
});

// maps component callbacks (ie user events) to redux actions
// in the component, call this.callbacks.someMethod
// and from here return an object with keys = callback name (someMethod),
// and values = functions returning an action
const mapViewCallbacksToActions = () => ({
  onNodeClicked: (id, isAggregated) => selectNode(id, isAggregated),
  onNodeHighlighted: (id, isAggregated) => highlightNode(id, isAggregated),
  onExpandClick: () => toggleNodesExpand(),
  onClearClick: () => resetState()
});

export default connect(Sankey, mapMethodsToState, mapViewCallbacksToActions);
