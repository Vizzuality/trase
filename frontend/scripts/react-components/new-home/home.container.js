import { connect } from 'react-redux';
import Home from 'react-components/new-home/home.component';
import { homeActions } from 'scripts/react-components/new-home/home.register';

const mapDispatchToProps = dispatch => ({
  clickEntrypoint: link => dispatch(homeActions.clickEntrypoint(link))
});
export default connect(null, mapDispatchToProps)(Home);
