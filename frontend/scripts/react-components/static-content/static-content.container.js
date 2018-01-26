import { connect } from 'react-redux';
import { NOT_FOUND } from 'redux-first-router';
import routerLinks from 'router/nav-links';
import StaticContent from './static-content.component';
import { getStaticContentFilename } from './static-content.actions';

function mapStateToProps(state) {
  const { staticContent, location } = state;
  const filename = getStaticContentFilename(location);
  const links = routerLinks[filename] || routerLinks.navSidebar;
  return {
    content: staticContent.markdown[filename],
    links,
    notFound: location.type === NOT_FOUND
  };
}

export default connect(mapStateToProps)(StaticContent);
