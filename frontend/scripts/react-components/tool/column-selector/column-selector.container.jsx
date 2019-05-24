import React from 'react';
import { connect } from 'react-redux';
import { selectColumn } from 'actions/tool.actions';
import ColumnSelector from 'react-components/tool/column-selector/column-selector.component';
import PropTypes from 'prop-types';

const mapStateToProps = state => ({
  allColumns: state.tool.columns,
  currentDropdown: state.app.currentDropdown,
  selectedColumnsIds: state.tool.selectedColumnsIds
});

const mapDispatchToProps = dispatch => ({
  onColumnSelected: (columnIndex, columnId) => {
    dispatch(selectColumn(columnIndex, columnId));
  }
});

class ColumnSelectorContainer extends React.PureComponent {
  constructor({ allColumns, group, selectedColumnsIds }) {
    super();
    const columnItems = allColumns.filter(column => column.group === group);
    this.state = {
      columnItems,
      selectedColumnItem: columnItems.filter(column => column.id === selectedColumnsIds[group])[0]
    };
  }

  handleColumnSelected = ({ item }) => {
    const { group, onColumnSelected } = this.props;
    const { columnItems } = this.state;
    const columnItem = columnItems.find(c => c.id === item.value);
    onColumnSelected(group, columnItem.id);
    this.setState({ selectedColumnItem: columnItem });
  };

  render() {
    const { selectedColumnItem, columnItems } = this.state;
    if (typeof selectedColumnItem === 'undefined') {
      return null;
    }

    const hasSingleElement = columnItems.length <= 1;

    return (
      <ColumnSelector
        hasSingleElement={hasSingleElement}
        columnItems={columnItems}
        selectedColumnItem={selectedColumnItem}
        handleColumnSelected={this.handleColumnSelected}
      />
    );
  }
}

ColumnSelectorContainer.propTypes = {
  group: PropTypes.number,
  allColumns: PropTypes.array,
  selectedColumnsIds: PropTypes.array,
  onColumnSelected: PropTypes.func.isRequired
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ColumnSelectorContainer);
