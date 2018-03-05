/* eslint-disable jsx-a11y/no-static-element-interactions,jsx-a11y/no-noninteractive-element-interactions */
import React, { Component } from 'react';
import FiltersDropdown from 'react-components/nav/filters-nav/filters-dropdown.component';
import cx from 'classnames';
import PropTypes from 'prop-types';

const id = 'filters';

class AdminLevelFilter extends Component {
  renderOptions() {
    const { onSelected, selectedFilter, filters } = this.props;

    return [{ value: 'none' }]
      .concat(filters.nodes)
      .filter(node => typeof selectedFilter === 'undefined' || node.name !== selectedFilter.name)
      .map((node, index) => (
        <li
          key={index}
          className={cx('dropdown-item', { '-disabled': node.isDisabled })}
          onClick={() => onSelected(node.name || node.value)}
        >
          {node.name !== undefined ? node.name.toLowerCase() : 'All'}
        </li>
      ));
  }

  render() {
    const { className, onToggle, currentDropdown, selectedFilter, filters } = this.props;

    return (
      filters && (
        <div
          className={cx('js-dropdown', className)}
          onClick={() => {
            onToggle(id);
          }}
        >
          <div className="c-dropdown -capitalize">
            <span className="dropdown-label">{filters.name.toLowerCase()}</span>
            <span className="dropdown-title">
              {selectedFilter !== undefined && selectedFilter.name !== undefined
                ? selectedFilter.name.toLowerCase()
                : 'All'}
            </span>
            <FiltersDropdown id={id} currentDropdown={currentDropdown} onClickOutside={onToggle}>
              <ul className="dropdown-list -medium">{this.renderOptions()}</ul>
            </FiltersDropdown>
          </div>
        </div>
      )
    );
  }
}

AdminLevelFilter.propTypes = {
  className: PropTypes.string,
  onToggle: PropTypes.func,
  onSelected: PropTypes.func,
  currentDropdown: PropTypes.string,
  selectedFilter: PropTypes.object,
  filters: PropTypes.object
};

export default AdminLevelFilter;
