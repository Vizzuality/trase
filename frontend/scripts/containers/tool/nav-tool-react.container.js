import { connect } from 'preact-redux';
import Nav from 'react-components/tool/nav-tool.component.js';

const mapStateToProps = (state) => {
  return {
    tooltips: state.app.tooltips,
    selectedContext: state.tool.selectedContext
  };
};

export default connect(
  mapStateToProps
)(Nav);
