import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  goToNodeProfilePage,
  searchNodeWithTerm
} from 'react-components/profile-root/profile-root.actions';
import SearchInput from 'react-components/shared/search-input/search-input.component';

function mapStateToProps(state) {
  const searchOptions = {
    year: state.app.selectedContext ? state.app.selectedContext.defaultYear : null,
    contextId: state.app.selectedContext ? state.app.selectedContext.id : null
  };
  return {
    searchOptions,
    items: state.profileRoot.search.results,
    isLoading: state.profileRoot.search.isLoading,
    isDisabled: (searchOptions.year || searchOptions.contextId) === null
  };
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      onSelect: goToNodeProfilePage,
      onSearchTermChange: searchNodeWithTerm
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchInput);
