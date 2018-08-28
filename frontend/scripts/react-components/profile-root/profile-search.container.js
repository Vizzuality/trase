import { connect } from 'react-redux';
import ProfileSearch from 'react-components/profile-root/profile-search.component';
import { bindActionCreators } from 'redux';
import {
  goToNodeProfilePage,
  searchNodeWithTerm
} from 'react-components/profile-root/profile-root.actions';

function mapStateToProps(state) {
  return {
    nodes: state.profileRoot.search.results,
    isLoading: state.profileRoot.search.isLoading
  };
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      onNodeSelected: goToNodeProfilePage,
      onSearchTermChange: searchNodeWithTerm
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProfileSearch);
