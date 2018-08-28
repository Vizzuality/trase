// import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Dasboards from 'react-components/dashboards/dashboards.component';

const mapStateToProps = state => ({
  posts: state.home.posts
});

export default connect(mapStateToProps)(Dasboards);
