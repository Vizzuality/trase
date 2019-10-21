import { connect, batch } from 'react-redux';
import ToolSwitch from 'react-components/tool/tool-switch/tool-switch.component';
import {
  switchTool,
  TOOL_LINKS__SWITCH_TOOL
} from 'react-components/tool-links/tool-links.actions';

const mapStateToProps = state => ({
  dashboardSelected: state.location.payload.section === 'data-view'
});

const mapDispatchToProps = dispatch => ({
  switchTool: section =>
    batch(() => {
      dispatch(switchTool(section));
      dispatch({
        type: TOOL_LINKS__SWITCH_TOOL,
        section
      });
    })
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ToolSwitch);
