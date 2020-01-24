import { connect } from 'react-redux';
import routerLinks from 'router/nav-links';
import { onDownloadPDF } from 'react-components/profile-node/profile-node.register';
import TopNav from './top-nav.component';

function mapStateToProps(state) {
  const { type, routesMap } = state.location;
  return {
    page: type,
    links: routerLinks.nav,
    showLogo: type !== 'home',
    ...routesMap[type].nav
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onDownloadPDF: () => dispatch(onDownloadPDF())
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TopNav);
