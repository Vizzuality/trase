import { connect } from 'react-redux';
import ProfileSearch from 'react-components/profile-search/profile-search.component';

function mapStateToProps(state) {
  return {
    nodes: state.profileSearch.nodes,
    errorMessage: state.profileSearch.errorMessage
  };
}

export default connect(mapStateToProps)(ProfileSearch);
