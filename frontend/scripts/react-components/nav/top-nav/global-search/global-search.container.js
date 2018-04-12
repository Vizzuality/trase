import { loadSearchResults } from 'actions/app.actions';
import GlobalSearch from 'react-components/nav/top-nav/global-search/global-search.component';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

const mapStateToProps = state => {
  const { search } = state.app;

  return {
    searchResults: search.results.map(n => ({
      id: n.id,
      name: n.name,
      contextId: n.contextId,
      profileType: n.profile,
      type: n.nodeType
    }))
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
