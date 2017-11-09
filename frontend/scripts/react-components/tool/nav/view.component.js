import { h } from 'preact';
import Tooltip from 'react-components/tool/help-tooltip.component';
import Dropdown from 'react-components/tool/nav/dropdown.component';

const id = 'view';

export default ({ onToggle, onSelected, currentDropdown, tooltips, isDetailedView }) => {
  const title = (isDetailedView === true) ? 'Complete' : 'Summary';
  const other = (isDetailedView === true) ? 'Summary' : 'Complete';
  return (
    <div class='nav-item js-dropdown' onClick={() => { onToggle(id); }}>
      <div class='c-dropdown -small'>
        <span class='dropdown-label'>
          Change view
          <Tooltip text={tooltips.sankey.nav.view.main} position='top right' />
        </span>
        <span class='dropdown-title'>
          {title}
        </span>
        <Dropdown id={id} currentDropdown={currentDropdown} onClickOutside={onToggle}>
          <ul class='dropdown-list -right'>
            <li
              class='dropdown-item'
              onClick={() => onSelected(!isDetailedView)}>
              {other}
            </li>
          </ul>
        </Dropdown>
      </div>
    </div>
  );
};
