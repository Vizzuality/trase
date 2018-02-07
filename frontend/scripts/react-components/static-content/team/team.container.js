import { connect } from 'react-redux';
import Team from './team.component';

function mapStateToProps(state) {
  const { staticContent } = state;
  return {
    content: Object.values(staticContent.team)
  };
}

export default connect(mapStateToProps)(Team);
