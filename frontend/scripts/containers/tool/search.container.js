import _ from 'lodash';
import connect from 'connect';
import Search from 'components/shared/search.component.js';
import { searchNode } from 'actions/tool.actions';

const mapMethodsToState = () => ({
  loadNodes: {
    _comparedValue: (state) => state.tool.nodesDict,
    _returnedValue: (state) => {
      return _.values(state.tool.nodesDict)
        .filter(
          node => node.hasFlows === true &&
          node.isAggregated !== true &&
          node.isUnknown !== true
        );
    }
  }
});

const mapViewCallbacksToActions = () => ({
  onNodeSelected: node => searchNode(parseInt(node.id, 10)),
});


export default connect(Search, mapMethodsToState, mapViewCallbacksToActions);
