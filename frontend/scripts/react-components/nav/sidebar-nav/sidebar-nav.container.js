import { connect } from 'react-redux';
import routerLinks from 'router/nav-links';
import { staticContentActions } from 'react-components/static-content/static-content.register';
import SidebarNav from './sidebar-nav.component';

function mapStateToProps(state) {
  const { location } = state;
  const filename = staticContentActions.getStaticContentFilename(location);
  const links = routerLinks[filename] || routerLinks.sidebarNav;

  return {
    links,
    filename // forcing to re-render when filename has changed
  };
}

export default connect(mapStateToProps)(SidebarNav);
