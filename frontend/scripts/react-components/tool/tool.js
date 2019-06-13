import ToolComponent from 'react-components/tool/tool.component';
import { connect } from 'react-redux';
import { resizeSankeyTool } from 'react-components/tool/tool.thunks';
import { getToolUrlProps } from 'react-components/tool/tool.selectors';

const mapStateToProps = state => ({
  urlProps: getToolUrlProps(state)
});

const mapDispatchToProps = dispatch => ({
  resizeSankeyTool: () => resizeSankeyTool(dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ToolComponent);
