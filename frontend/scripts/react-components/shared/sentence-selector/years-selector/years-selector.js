import { connect } from 'react-redux';
import { selectYears } from 'app/app.register';
import YearsSelector from 'react-components/shared/sentence-selector/years-selector/years-selector.component';
import { getToolYearsProps } from 'react-components/tool-links/tool-links.selectors';

const mapStateToProps = state => getToolYearsProps(state);

const mapDispatchToProps = { selectYears };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(YearsSelector);
