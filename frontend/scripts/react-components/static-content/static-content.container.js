import { connect } from 'react-redux';
import { NOT_FOUND } from 'redux-first-router';
import StaticContent from './static-content.component';

function mapStateToProps(state) {
  const { location } = state;
  const Content = location.routesMap[location.type].component;
  return {
    Content,
    notFound: location.type === NOT_FOUND
  };
}

export default connect(mapStateToProps)(StaticContent);
