import { connect } from 'react-redux';
import ToolSwitch from 'react-components/shared/tool-bar/tool-switch/tool-switch.component';
import { switchTool } from 'react-components/tool-links/tool-links.register';

const mapStateToProps = state => ({
  dashboardSelected: state.location.payload.section === 'data-view'
});

const mapDispatchToProps = { switchTool };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ToolSwitch);
