import { connect } from 'react-redux';
import routerLinks from 'router/nav-links';
import { staticContentActions } from 'react-components/static-content/static-content.register';
import SidebarNav from './sidebar-nav.component';

function mapStateToProps(state) {
  const { location } = state;
  console.log('s', location, state);
  const filename = staticContentActions.getStaticContentFilename(location);
  const links = routerLinks[filename] || routerLinks.sidebarNav;

  return {
    links,
    title: location.type,
    filename // forcing to re-render when filename has changed
  };
}

export default connect(mapStateToProps)(SidebarNav);
