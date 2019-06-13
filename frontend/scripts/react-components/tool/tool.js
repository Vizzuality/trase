import ToolComponent from 'react-components/tool/tool.component';
import { connect } from 'react-redux';
import { resizeSankeyTool } from 'react-components/tool/tool.thunks';

const mapDispatchToProps = dispatch => ({
  resizeSankeyTool: () => resizeSankeyTool(dispatch)
});

export default connect(
  null,
  mapDispatchToProps
)(ToolComponent);
