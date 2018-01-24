import { connect } from 'react-redux';
import { NOT_FOUND } from 'redux-first-router';
import StaticContent from './static-content.component';
import sidebarLinks from './static-content-links';
import { getStaticContentFilename } from './static-content.actions';

function mapStateToProps(state) {
  const { staticContent, location } = state;
  const filename = getStaticContentFilename(location);
  const links = sidebarLinks[filename] || sidebarLinks.default;
  return {
    content: staticContent.markdown[filename],
    links,
    notFound: location.type === NOT_FOUND
  };
}

export default connect(mapStateToProps)(StaticContent);
