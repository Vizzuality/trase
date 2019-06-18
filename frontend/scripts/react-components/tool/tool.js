import { createSelector } from 'reselect';
import ToolComponent from 'react-components/tool/tool.component';
import { connect } from 'react-redux';
import { resizeSankeyTool } from 'react-components/tool/tool.thunks';
import { getToolLinksUrlProps } from 'react-components/tool-links/tool-links.selectors';
import { getAppUrlProps } from 'reducers/app.selectors';

const getUrlProps = createSelector(
  [getToolLinksUrlProps, getAppUrlProps],
  (toolLinks, app) => ({ ...toolLinks, ...app })
);

const mapStateToProps = state => ({
  urlProps: getUrlProps(state)
});

const mapDispatchToProps = dispatch => ({
  resizeSankeyTool: () => resizeSankeyTool(dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ToolComponent);
