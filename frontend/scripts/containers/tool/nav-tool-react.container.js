import { connect } from 'react-redux';
import Nav from 'react-components/tool/nav-tool.component';

const mapStateToProps = state => ({
  tooltips: state.app.tooltips,
  selectedContext: state.tool.selectedContext
});

export default connect(mapStateToProps)(Nav);
