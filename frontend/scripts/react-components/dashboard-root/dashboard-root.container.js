// import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import DasboardRoot from 'react-components/dashboard-root/dashboard-root.component';

const mapStateToProps = state => ({
  posts: state.home.posts
});

export default connect(mapStateToProps)(DasboardRoot);
