import { loadSearchResults } from 'app/app.register';
import GlobalSearch from 'react-components/nav/global-search/global-search.component';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getAppSearchResults } from 'react-components/nav/global-search/global-search.selectors';
import { TOOL_LAYOUT } from 'constants';

const mapStateToProps = state => {
  const { search } = state.app;
  const searchResults = getAppSearchResults(state);

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
            serializerParams: {
              toolLayout: TOOL_LAYOUT.right,
              countries: item.countryId,
              commodities: item.commodityId,
              selectedNodesIds: item.nodes.map(i => i.id),
              __temporaryExpandedNodes: item.nodes
            }
          }
        })
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(GlobalSearch);
