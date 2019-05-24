import { connect } from 'react-redux';
import { toggleDropdown } from 'actions/app.actions';
import { selectColumn } from 'actions/tool.actions';
import ColumnSelector from 'react-components/tool/column-selector/column-selector.component';

const mapStateToProps = state => ({
  allColumns: state.tool.columns,
  currentDropdown: state.app.currentDropdown,
  selectedColumnsIds: state.tool.selectedColumnsIds
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
