import { h } from 'preact';
import Dropdown from 'react-components/tool/nav/dropdown.component';
import RecolorByNodeLegendSummary from 'containers/tool/nav/recolor-by-node-legend-summary.container';
import classNames from 'classnames';

export default ({ onToggle, onColumnSelected, currentDropdown, group, allColumns, selectedColumnsIds, nodesColoredAtColumn }) => {
  const id = `column${group}`;
  const columnItems = allColumns.filter(column => column.group === group);
  const selectedColumnItem = columnItems.filter(column => column.id === selectedColumnsIds[group])[0];

  const hasSingleElement = columnItems.length <= 1;

  return (
    <div
      class={classNames('js-dropdown c-dropdown -column-selector', { ['-hide-only-child']: hasSingleElement })}
      onClick={() => { onToggle(id); }}
    >
      <span class={classNames('dropdown-title', { ['-is-open']: currentDropdown === id })}>
        {selectedColumnItem.name}
      </span>
      {nodesColoredAtColumn === group &&
        <RecolorByNodeLegendSummary />
      }
      <Dropdown id={id} currentDropdown={currentDropdown} onClickOutside={onToggle}>
        <ul class='dropdown-list'>
          {columnItems.map(columnItem => <li
            class='dropdown-item'
            onClick={() => onColumnSelected(group, columnItem.id)}>
            {columnItem.name}
          </li>
          )}
        </ul>
      </Dropdown>
    </div>
  );
};
