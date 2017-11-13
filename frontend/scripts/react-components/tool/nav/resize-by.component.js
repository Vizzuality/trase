import { h } from 'preact';
import classNames from 'classnames';
import Tooltip from 'react-components/tool/help-tooltip.component';
import Dropdown from 'react-components/tool/nav/dropdown.component';

const id = 'resize-by';

export default ({ tooltips, onToggle, onSelected, currentDropdown, selectedResizeBy, resizeBys }) => {
  resizeBys.sort((a, b) => a.position > b.position);
  const resizeByElements = [];
  if (currentDropdown === 'resize-by') {
    resizeBys
      .filter(resizeBy => resizeBy.name !== selectedResizeBy.name)
      .forEach((resizeBy, index, currentResizeBys) => {
        if (index > 0 && currentResizeBys[index - 1].groupNumber !== resizeBy.groupNumber) {
          resizeByElements.push(<li class='dropdown-item -separator' />);
        }
        resizeByElements.push(<li
          class={classNames('dropdown-item', { '-disabled': resizeBy.isDisabled })}
          onClick={() => onSelected(resizeBy.name)}
          >
          {resizeBy.label.toLowerCase()}
          {resizeBy.description &&
            <Tooltip position='bottom right' text={resizeBy.description} />
          }
        </li>);
      });
  }

  const hasZeroOrSingleElement = resizeBys.length <= 1;

  return (
    <div class='nav-item js-dropdown' onClick={() => { onToggle(id); }}>
      <div class={classNames('c-dropdown -small -capitalize', { ['-hide-only-child']: hasZeroOrSingleElement } )}>
        <span class='dropdown-label'>
          Resize by
          <Tooltip position='top right' text={tooltips.sankey.nav.resizeBy.main} />
        </span>
        <span class='dropdown-title -small'>
          {selectedResizeBy.label.toLowerCase()}
        </span>
        {selectedResizeBy.name && tooltips.sankey.nav.resizeBy[selectedResizeBy.name] &&
          <Tooltip position='bottom right' floating text={tooltips.sankey.nav.resizeBy[selectedResizeBy.name]} />
        }
        <Dropdown id={id} currentDropdown={currentDropdown} onClickOutside={onToggle}>
          <ul class='dropdown-list -medium'>
            {resizeByElements}
          </ul>
        </Dropdown>
      </div>
    </div>
  );
};
