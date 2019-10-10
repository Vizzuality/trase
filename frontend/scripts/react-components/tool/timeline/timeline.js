import { connect } from 'react-redux';
import { selectYears } from 'actions/app.actions';
import Timeline from 'react-components/tool/timeline/timeline.component';
import { getToolYearsProps } from 'react-components/tool-links/tool-links.selectors';

const mapStateToProps = state => getToolYearsProps(state);

const mapDispatchToProps = { selectYears };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Timeline);
