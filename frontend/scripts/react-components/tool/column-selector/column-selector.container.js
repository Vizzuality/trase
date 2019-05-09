import { connect } from 'react-redux';
import { toggleDropdown } from 'actions/app.actions';
import { selectColumn } from 'actions/tool.actions';
import ColumnSelector from 'react-components/tool/column-selector/column-selector.component';
import { getToolRecolorGroups } from 'react-components/tool/tool.selectors';

const mapStateToProps = state => ({
  allColumns: state.toolLinks.columns,
  currentDropdown: state.app.currentDropdown,
  selectedColumnsIds: state.toolLinks.selectedColumnsIds,
  nodesColoredAtColumn: state.toolLinks.nodesColoredAtColumn,
  recolorGroups: getToolRecolorGroups(state)
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
