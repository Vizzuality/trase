import { connect } from 'preact-redux';
import ColumnsSelector from 'react-components/tool/columns-selector.component.js';

const mapStateToProps = (state) => {
  return {
    columns: state.tool.columns,
    sankeySize: state.app.sankeySize
  };
};

export default connect(
  mapStateToProps
)(ColumnsSelector);
