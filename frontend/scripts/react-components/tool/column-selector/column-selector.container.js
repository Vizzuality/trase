import { connect } from 'react-redux';
import { toggleDropdown } from 'actions/app.actions';
import { selectColumn } from 'actions/tool.actions';
import ColumnSelector from 'react-components/tool/column-selector/column-selector.component';

const mapStateToProps = state => ({
  currentDropdown: state.app.currentDropdown,
  allColumns: state.tool.columns,
  selectedColumnsIds: state.tool.selectedColumnsIds,
  nodesColoredAtColumn: state.tool.nodesColoredAtColumn
});

const mapDispatchToProps = dispatch => ({
  onToggle: id => {
    dispatch(toggleDropdown(id));
  },
  onColumnSelected: (columnIndex, columnId) => {
    dispatch(selectColumn(columnIndex, columnId));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ColumnSelector);
