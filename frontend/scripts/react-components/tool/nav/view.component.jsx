/* eslint-disable jsx-a11y/no-noninteractive-element-interactions,jsx-a11y/no-static-element-interactions */
import React from 'react';
import Tooltip from 'react-components/tool/help-tooltip.component';
import Dropdown from 'react-components/tool/nav/dropdown.component';
import PropTypes from 'prop-types';

const id = 'view';

export default function view({ onToggle, onSelected, currentDropdown, tooltips, isDetailedView }) {
  const title = isDetailedView === true ? 'Complete' : 'Summary';
  const other = isDetailedView === true ? 'Summary' : 'Complete';
  return (
    <div
      className="nav-item js-dropdown"
      onClick={() => {
        onToggle(id);
      }}
    >
      <div className="c-dropdown -small">
        <span className="dropdown-label">
          Change view
          <Tooltip text={tooltips.sankey.nav.view.main} position="top right" />
        </span>
        <span className="dropdown-title">{title}</span>
        <Dropdown id={id} currentDropdown={currentDropdown} onClickOutside={onToggle}>
          <ul className="dropdown-list -right">
            <li className="dropdown-item" onClick={() => onSelected(!isDetailedView)}>
              {other}
            </li>
          </ul>
        </Dropdown>
      </div>
    </div>
  );
}

view.propTypes = {
  onToggle: PropTypes.func,
  onSelected: PropTypes.func,
  currentDropdown: PropTypes.string,
  tooltips: PropTypes.object,
  isDetailedView: PropTypes.bool
};
