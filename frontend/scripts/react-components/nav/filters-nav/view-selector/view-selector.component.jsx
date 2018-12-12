/* eslint-disable jsx-a11y/no-noninteractive-element-interactions,jsx-a11y/no-static-element-interactions */
import React from 'react';
import Tooltip from 'react-components/shared/help-tooltip/help-tooltip.component';
import FiltersDropdown from 'react-components/nav/filters-nav/filters-dropdown.component';
import PropTypes from 'prop-types';
import cx from 'classnames';

const id = 'view';

function ViewSelector({
  className,
  onToggle,
  onSelected,
  currentDropdown,
  tooltips,
  isDetailedView
}) {
  const title = isDetailedView === true ? 'All Flows' : 'Summary';
  const other = isDetailedView === true ? 'Summary' : 'All Flows';
  return (
    <div
      className={cx('js-dropdown', className)}
      onClick={() => {
        onToggle(id);
      }}
    >
      <div className="c-dropdown -small">
        <span className="dropdown-label">
          Change view
          <Tooltip text={tooltips.sankey.nav.view.main} constraint="window" />
        </span>
        <span className="dropdown-title -small">{title}</span>
        <FiltersDropdown id={id} currentDropdown={currentDropdown} onClickOutside={onToggle}>
          <ul className="dropdown-list">
            <li className="dropdown-item" onClick={() => onSelected(!isDetailedView)}>
              {other}
            </li>
          </ul>
        </FiltersDropdown>
      </div>
    </div>
  );
}

ViewSelector.propTypes = {
  className: PropTypes.string,
  onToggle: PropTypes.func,
  onSelected: PropTypes.func,
  currentDropdown: PropTypes.string,
  tooltips: PropTypes.object,
  isDetailedView: PropTypes.bool
};

export default ViewSelector;
