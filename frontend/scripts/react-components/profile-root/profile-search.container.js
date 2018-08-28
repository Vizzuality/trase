import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  goToNodeProfilePage,
  searchNodeWithTerm
} from 'react-components/profile-root/profile-root.actions';
import SearchInput from 'react-components/shared/search-input/search-input.component';

function mapStateToProps(state) {
  return {
    year: state.app.selectedContext ? state.app.selectedContext.defaultYear : null,
    items: state.profileRoot.search.results,
    isLoading: state.profileRoot.search.isLoading
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
