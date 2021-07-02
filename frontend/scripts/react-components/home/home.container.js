import { connect } from 'react-redux';
import Home from 'react-components/home/home.component';
import { homeActions } from 'scripts/react-components/home/home.register';

const mapDispatchToProps = dispatch => ({
  clickEntrypoint: link => dispatch(homeActions.clickEntrypoint(link))
});

export default connect(null, mapDispatchToProps)(Home);
