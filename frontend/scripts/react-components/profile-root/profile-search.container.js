import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  goToNodeProfilePage,
  searchNodeWithTerm
} from 'react-components/profile-root/profile-root.register';
import SearchInput from 'react-components/shared/search-input/search-input.component';

function mapStateToProps(state) {
  return {
    items: state.profileRoot.search.results,
    isLoading: state.profileRoot.search.isLoading,
    contexts: state.app.contexts,
    variant: 'slim'
  };
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      onSelect: node => goToNodeProfilePage(node),
      onSearchTermChange: searchNodeWithTerm
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchInput);
