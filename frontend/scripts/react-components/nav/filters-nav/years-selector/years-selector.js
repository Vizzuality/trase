import { connect } from 'react-redux';
import { selectYears } from 'app/app.actions';
import YearsSelector from 'react-components/nav/filters-nav/years-selector/years-selector.component';
import { getToolYearsProps } from 'react-components/tool-links/tool-links.selectors';

const mapStateToProps = state => getToolYearsProps(state);

const mapDispatchToProps = { selectYears };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(YearsSelector);
