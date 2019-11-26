import { connect } from 'react-redux';
import ToolSwitch from 'react-components/tool/tool-switch/tool-switch.component';
import { switchTool } from 'react-components/tool-links/tool-links.actions';

const mapStateToProps = state => ({
  dashboardSelected: state.location.payload.section === 'data-view'
});

const mapDispatchToProps = { switchTool };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ToolSwitch);
