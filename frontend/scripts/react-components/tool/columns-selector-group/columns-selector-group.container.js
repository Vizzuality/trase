import { connect } from 'react-redux';
import ColumnsSelectorGroup from 'react-components/tool/columns-selector-group/columns-selector-group.component';

const mapStateToProps = state => ({
  columns: state.tool.columns,
  sankeySize: state.app.sankeySize
});

export default connect(mapStateToProps)(ColumnsSelectorGroup);
