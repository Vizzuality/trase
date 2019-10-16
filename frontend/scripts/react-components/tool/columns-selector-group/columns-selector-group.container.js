import { connect } from 'react-redux';
import ColumnsSelectorGroup from 'react-components/tool/columns-selector-group/columns-selector-group.component';
import { getSelectedColumnsIds } from 'react-components/tool/tool.selectors';

const mapStateToProps = state => ({
  sankeySize: state.toolLayers.sankeySize,
  columns: state.toolLinks.data.columns,
  extraColumnId: state.toolLinks.extraColumnId,
  selectedColumnsIds: getSelectedColumnsIds(state)
});

export default connect(mapStateToProps)(ColumnsSelectorGroup);
