import { connect } from 'react-redux';
import ColumnsSelectorGroup from 'react-components/tool/columns-selector-group/columns-selector-group.component';

const mapStateToProps = state => ({
  sankeySize: state.app.sankeySize,
  columns: state.toolLinks.data.columns
});

export default connect(mapStateToProps)(ColumnsSelectorGroup);
