import { connect } from 'react-redux';
import routerLinks from 'router/nav-links';
import Nav from './nav.component';

function mapStateToProps(state) {
  const { type, routesMap } = state.location;
  return {
    ...routesMap[type].nav,
    links: routerLinks.nav,
    showLogo: type !== 'home'
  };
}

export default connect(mapStateToProps)(Nav);
