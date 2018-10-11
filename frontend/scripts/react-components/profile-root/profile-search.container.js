import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  goToNodeProfilePage,
  searchNodeWithTerm
} from 'react-components/profile-root/profile-root.actions';
import SearchInput from 'react-components/shared/search-input/search-input.component';

function mapStateToProps(state) {
  return {
    items: state.profileRoot.search.results,
    isLoading: state.profileRoot.search.isLoading
  };
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      onSelect: node => goToNodeProfilePage(node),
      onSearchTermChange: searchTerm => searchNodeWithTerm(searchTerm)
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchInput);
