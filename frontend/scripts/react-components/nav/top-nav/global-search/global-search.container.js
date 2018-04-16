import { loadSearchResults } from 'actions/app.actions';
import GlobalSearch from 'react-components/nav/top-nav/global-search/global-search.component';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import groupBy from 'lodash/groupBy';

const mapStateToProps = state => {
  const { search } = state.app;
  const { contexts } = state.tool;

  const searchResults = Object.values(
    groupBy(search.results, ({ mainId, contextId }) => `${mainId}_${contextId}`)
  ).map(nodes => {
    const node = nodes[0];
    const ctx = contexts.find(c => c.id === node.contextId);
    const nodeType = nodes.map(n => n.nodeType).join(' & ');

    return {
      name: node.name,
      nodeTypeText: `${nodeType} for ${ctx.countryName} ${ctx.commodityName}`,
      contextId: node.contextId,
      nodes
    };
  });

  return {
    isLoading: search.isLoading,
    searchTerm: search.term,
    searchResults
  };
};

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      onInputValueChange: inputValue => loadSearchResults(inputValue)
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(GlobalSearch);
