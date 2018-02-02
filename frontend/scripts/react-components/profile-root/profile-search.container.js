import { connect } from 'react-redux';
import ProfileSearch from 'react-components/profile-root/profile-search.component';
import { bindActionCreators } from 'redux';
import { goToNodeProfilePage } from 'react-components/profile-root/profile-root.actions';

function mapStateToProps(state) {
  return {
    nodes: state.profileRoot.nodes
  };
}

const mapDispatchToProps = dispatch =>
  bindActionCreators({ onNodeSelected: node => goToNodeProfilePage(node) }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(ProfileSearch);
