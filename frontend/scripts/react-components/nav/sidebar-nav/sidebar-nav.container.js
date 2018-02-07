import { connect } from 'react-redux';
import routerLinks from 'router/nav-links';
import { getStaticContentFilename } from 'react-components/static-content/static-content.actions';
import SidebarNav from './sidebar-nav.component';

function mapStateToProps(state) {
  const { location } = state;
  const filename = getStaticContentFilename(location);
  const links = routerLinks[filename] || routerLinks.sidebarNav;
  return {
    links
  };
}

export default connect(mapStateToProps)(SidebarNav);
