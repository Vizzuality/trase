/* eslint-disable jsx-a11y/no-static-element-interactions,jsx-a11y/no-noninteractive-element-interactions */
import React, { Component } from 'react';
import Dropdown from 'react-components/tool/nav/dropdown.component';
import classNames from 'classnames';
import PropTypes from 'prop-types';

const id = 'filters';

class Filters extends Component {
  renderOptions() {
    const {
      onSelected, selectedFilter, filters
    } = this.props;

    return [{ value: 'none' }]
      .concat(filters.nodes)
      .filter(node => selectedFilter === undefined || node.name !== selectedFilter.name)
      .map((node, index) => (
        <li
          key={index}
          className={classNames('dropdown-item', { '-disabled': node.isDisabled })}
          onClick={() => onSelected(node.name || node.value)}
        >
          {(node.name !== undefined) ? node.name.toLowerCase() : 'All'}
        </li >));
  }

  render() {
    const {
      onToggle, currentDropdown, selectedFilter, filters
    } = this.props;

    return (
      <div
        className="nav-item js-dropdown"
        onClick={() => {
          onToggle(id);
        }}
      >
        <div className="c-dropdown -capitalize" >
          <span className="dropdown-label" >
            {filters.name.toLowerCase()}
          </span >
          <span className="dropdown-title" >
            {(selectedFilter !== undefined && selectedFilter.name !== undefined)
              ? selectedFilter.name.toLowerCase()
              : 'All'}
          </span >
          <Dropdown id={id} currentDropdown={currentDropdown} onClickOutside={onToggle} >
            <ul className="dropdown-list -medium" >
              {this.renderOptions()}
            </ul >
          </Dropdown >
        </div >
      </div >
    );
  }
}

Filters.propTypes = {
  onToggle: PropTypes.func,
  onSelected: PropTypes.func,
  currentDropdown: PropTypes.string,
  selectedFilter: PropTypes.object,
  filters: PropTypes.object
};

export default Filters;
