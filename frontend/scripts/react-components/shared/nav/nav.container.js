import { connect } from 'react-redux';
import Nav from './nav.component';

function mapStateToProps(state) {
  const { type, routesMap } = state.location;
  return routesMap[type].nav || {};
}

export default connect(mapStateToProps)(Nav);
