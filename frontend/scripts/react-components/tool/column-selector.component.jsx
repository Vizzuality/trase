/* eslint-disable jsx-a11y/no-noninteractive-element-interactions,jsx-a11y/no-static-element-interactions */
import React from 'react';
import Dropdown from 'react-components/tool/nav/dropdown.component';
import RecolorByNodeLegendSummary from 'containers/tool/nav/recolor-by-node-legend-summary.container';
import classNames from 'classnames';
import PropTypes from 'prop-types';

function columnSelector({
  onToggle,
  onColumnSelected,
  currentDropdown,
  group,
  allColumns,
  selectedColumnsIds,
  nodesColoredAtColumn
}) {
  const id = `column${group}`;
  const columnItems = allColumns.filter(column => column.group === group);
  const selectedColumnItem = columnItems.filter(column => column.id === selectedColumnsIds[group])[0];

  const hasSingleElement = columnItems.length <= 1;

  return (
    <div
      className={classNames('js-dropdown c-dropdown -column-selector', { '-hide-only-child': hasSingleElement })}
      onClick={() => {
        onToggle(id);
      }}
    >
      <span className={classNames('dropdown-title', { '-is-open': currentDropdown === id })} >
        {selectedColumnItem.name}
      </span >
      {nodesColoredAtColumn === group &&
      <RecolorByNodeLegendSummary />
      }
      <Dropdown id={id} currentDropdown={currentDropdown} onClickOutside={onToggle} >
        <ul className="dropdown-list" >
          {columnItems.map((columnItem, index) => (
            <li
              key={index}
              className="dropdown-item"
              onClick={() => onColumnSelected(group, columnItem.id)}
            >
              {columnItem.name}
            </li >
          ))}
        </ul >
      </Dropdown >
    </div >
  );
}

columnSelector.propTypes = {
  onToggle: PropTypes.func,
  onColumnSelected: PropTypes.func,
  currentDropdown: PropTypes.string,
  group: PropTypes.number,
  allColumns: PropTypes.array,
  selectedColumnsIds: PropTypes.array,
  nodesColoredAtColumn: PropTypes.number
};

export default columnSelector;
