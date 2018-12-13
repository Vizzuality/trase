import { loadSearchResults } from 'actions/app.actions';
import GlobalSearch from 'react-components/nav/global-search/global-search.component';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import groupBy from 'lodash/groupBy';

function getNodeTypeText(nodes, contexts) {
  const nodeType = nodes.map(n => n.nodeType).join(' & ');
  const ctx = contexts.find(c => c.id === nodes[0].contextId);

  if (!ctx) return nodeType;

  return `${nodeType} - ${ctx.commodityName} - ${ctx.countryName}`;
}

function byContextMainIdAndNodeType({ mainId, contextId, nodeType }) {
  const nodeTypeGroup = ['IMPORTER', 'EXPORTER'].includes(nodeType.toUpperCase())
    ? 'IM_EX'
    : nodeType;
  return `${contextId}_${mainId}_${nodeTypeGroup}`;
}

const mapStateToProps = state => {
  const { search, contexts } = state.app;

  const searchResults = Object.values(groupBy(search.results, byContextMainIdAndNodeType)).map(
    nodes => {
      const node = nodes[0];
      const { defaultYear = null } = contexts.find(c => c.id === node.contextId) || {};

      return {
        nodes,
        defaultYear,
        name: node.name,
        contextId: node.contextId,
        isSubnational: node.isSubnational,
        nodeTypeText: getNodeTypeText(nodes, contexts)
      };
    }
  );

  return {
    isLoading: search.isLoading,
    searchTerm: search.term,
    searchResults
  };
};

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      onInputValueChange: inputValue => loadSearchResults(inputValue),
      onItemSelected: item =>
        dispatch({
          type: 'tool',
          payload: {
            query: {
              state: {
                isMapVisible: false,
                selectedContextId: item.contextId,
                selectedNodesIds: item.nodes.map(i => i.id),
                expandedNodesIds: item.nodes.map(i => i.id)
              }
            }
          }
        })
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GlobalSearch);
