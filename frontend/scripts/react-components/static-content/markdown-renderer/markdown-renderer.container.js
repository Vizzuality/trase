import { connect } from 'react-redux';
import { getStaticContentFilename } from 'react-components/static-content/static-content.register';
import MarkdownRenderer from './markdown-renderer.component';

function mapStateToProps(state) {
  const { staticContent, location } = state;
  const filename = getStaticContentFilename(location);
  return {
    content: staticContent.markdown[filename]
  };
}

export default connect(mapStateToProps)(MarkdownRenderer);
