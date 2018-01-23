import { connect } from 'react-redux';
import ProfileSearchBox from 'react-components/profile-search/profile-search-box.component';
import { bindActionCreators } from 'redux';
import { goToNodeProfilePage } from 'react-components/profile-search/profile-search.actions';

function mapStateToProps(state) {
  return {
    nodes: state.profileSearch.nodes
  };
}

const mapDispatchToProps = dispatch => bindActionCreators({
  onNodeSelected: node => goToNodeProfilePage(node)
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(ProfileSearchBox);
