/* eslint-disable jsx-a11y/no-noninteractive-element-interactions,jsx-a11y/no-static-element-interactions */
import React from 'react';
import FiltersDropdown from 'react-components/nav/filters-nav/filters-dropdown.component';
import cx from 'classnames';
import PropTypes from 'prop-types';

function ColumnSelector({
  onToggle,
  onColumnSelected,
  currentDropdown,
  group,
  allColumns,
  selectedColumnsIds
}) {
  const id = `column${group}`;
  const columnItems = allColumns.filter(column => column.group === group);
  const selectedColumnItem = columnItems.filter(
    column => column.id === selectedColumnsIds[group]
  )[0];

  if (typeof selectedColumnItem === 'undefined') {
    return null;
  }

  const hasSingleElement = columnItems.length <= 1;

  return (
    <div
      className={cx('js-dropdown c-dropdown -column-selector', {
        '-hide-only-child': hasSingleElement
      })}
      onClick={() => {
        onToggle(id);
      }}
    >
      <span className={cx('dropdown-title', { '-is-open': currentDropdown === id })}>
        {selectedColumnItem.name}
      </span>
      <FiltersDropdown id={id} currentDropdown={currentDropdown} onClickOutside={onToggle}>
        <ul className="dropdown-list">
          {columnItems.map((columnItem, index) => (
            <li
              key={index}
              className="dropdown-item"
              onClick={() => onColumnSelected(group, columnItem.id)}
            >
              {columnItem.name}
            </li>
          ))}
        </ul>
      </FiltersDropdown>
    </div>
  );
}

ColumnSelector.propTypes = {
  group: PropTypes.number,
  onToggle: PropTypes.func,
  allColumns: PropTypes.array,
  onColumnSelected: PropTypes.func,
  currentDropdown: PropTypes.string,
  selectedColumnsIds: PropTypes.array
};

export default ColumnSelector;
