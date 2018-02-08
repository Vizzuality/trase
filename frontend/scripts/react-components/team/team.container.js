import { connect } from 'react-redux';
import Team from './team.component';

function mapStateToProps(state) {
  const { staticContent } = state;
  const content = staticContent.team ? Object.values(staticContent.team) : [];
  return {
    content
  };
}

export default connect(mapStateToProps)(Team);
