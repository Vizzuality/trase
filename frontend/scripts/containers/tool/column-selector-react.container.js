import { connect } from 'preact-redux';
import { toggleDropdown } from 'actions/app.actions';
import { selectColumn } from 'actions/tool.actions';
import ColumnSelector from 'react-components/tool/column-selector.component.js';

const mapStateToProps = (state) => {
  return {
    currentDropdown: state.app.currentDropdown,
    allColumns: state.tool.columns,
    selectedColumnsIds: state.tool.selectedColumnsIds,
    nodesColoredAtColumn: state.tool.nodesColoredAtColumn
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onToggle: (id) => {
      dispatch(toggleDropdown(id));
    },
    onColumnSelected: (columnIndex, columnId) => {
      dispatch(selectColumn(columnIndex, columnId));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ColumnSelector);
