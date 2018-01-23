import { connect } from 'react-redux';
import StaticContent from './static-content.component';
import SidebarLinks from './static-content-links';
import { getStaticContentFilename } from './static-content.actions';

function mapStateToProps(state) {
  const { staticContent, location } = state;
  const filename = getStaticContentFilename(location);
  const links = SidebarLinks[filename];
  return {
    content: staticContent.markdown[filename],
    links
  };
}

export default connect(mapStateToProps)(StaticContent);
