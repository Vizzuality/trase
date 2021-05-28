import { connect } from 'react-redux';
import Home from 'react-components/new-home/home.component';
import { homeActions } from 'scripts/react-components/new-home/home.register';
import { getSelectedContext } from 'app/app.selectors';

const mapDispatchToProps = dispatch => ({
  clickEntrypoint: link => dispatch(homeActions.clickEntrypoint(link))
});

const mapStateToProps = state => ({
  defaultContext: getSelectedContext(state)
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);
