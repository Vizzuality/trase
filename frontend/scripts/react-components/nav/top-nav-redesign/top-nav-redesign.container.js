import { connect } from 'react-redux';
import routerLinks from 'router/nav-links';
import TopNav from './top-nav-redesign.component';

function mapStateToProps(state) {
  const { type, routesMap } = state.location;
  return {
    page: type,
    links: routerLinks.nav,
    showLogo: type !== 'home',
    ...routesMap[type].nav
  };
}

export default connect(mapStateToProps)(TopNav);
