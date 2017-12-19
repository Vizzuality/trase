import { connect } from 'react-redux';
import ColumnsSelector from 'react-components/tool/columns-selector.component';

const mapStateToProps = state => ({
  columns: state.tool.columns,
  sankeySize: state.app.sankeySize
});

export default connect(mapStateToProps)(ColumnsSelector);
