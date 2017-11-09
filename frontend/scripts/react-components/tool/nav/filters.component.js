import { h } from 'preact';
import Dropdown from 'react-components/tool/nav/dropdown.component';
import classNames from 'classnames';

const id = 'filters';

export default ({ onToggle, onSelected, currentDropdown, selectedFilter, filters }) => {
  return (
    <div class='nav-item js-dropdown' onClick={() => { onToggle(id); }}>
      <div class='c-dropdown -capitalize'>
        <span class='dropdown-label'>
          {filters.name.toLowerCase()}
        </span>
        <span class='dropdown-title'>
          {(selectedFilter !== undefined && selectedFilter.name !== undefined) ? selectedFilter.name.toLowerCase() : 'All'}
        </span>
        <Dropdown id={id} currentDropdown={currentDropdown} onClickOutside={onToggle}>
          <ul class='dropdown-list -medium'>
            {[{ value: 'none' }]
              .concat(filters.nodes)
              .filter(node => selectedFilter === undefined || node.name !== selectedFilter.name)
              .map(node => <li
                class={classNames('dropdown-item', { '-disabled': node.isDisabled })}
                onClick={() => onSelected(node.name || node.value)}
                >
                {(node.name !== undefined) ? node.name.toLowerCase() : 'All' }
              </li>)}
          </ul>
        </Dropdown>
      </div>
    </div>
  );
};
