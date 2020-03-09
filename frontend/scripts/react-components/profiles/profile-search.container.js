import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { profilesActions } from 'react-components/profiles/profiles.register';
import SearchInput from 'react-components/shared/search-input/search-input.component';

function mapStateToProps(state) {
  return {
    items: state.profiles.search.results,
    isLoading: state.profiles.search.isLoading,
    contexts: state.app.contexts,
    variant: 'slim'
  };
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      onSelect: node => profilesActions.goToNodeProfilePage(node),
      onSearchTermChange: profilesActions.searchNodeWithTerm
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(SearchInput);
