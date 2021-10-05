import { connect } from 'react-redux';
import { NOT_FOUND } from 'redux-first-router';
import StaticContent from './static-content.component';

function mapStateToProps(state, ownProps) {
  const { location } = state;

  const Content = ownProps.content;
  return {
    Content,
    notFound: location.type === NOT_FOUND
  };
}
export default connect(mapStateToProps)(StaticContent);
