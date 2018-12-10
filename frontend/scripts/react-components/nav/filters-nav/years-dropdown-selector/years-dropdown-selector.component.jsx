/* eslint-disable jsx-a11y/no-static-element-interactions,jsx-a11y/no-noninteractive-element-interactions */
import React, { Component } from 'react';
import FiltersDropdown from 'react-components/nav/filters-nav/filters-dropdown.component';
import cx from 'classnames';
import PropTypes from 'prop-types';

const id = 'years-dropdown';

class YearsDropdownSelector extends Component {
  renderOptions() {
    const { onSelected, years } = this.props;
    return years.map(year => (
      <li key={year} className={cx('dropdown-item')} onClick={() => onSelected(year)}>
        {year}
      </li>
    ));
  }

  render() {
    const { className, onToggle, currentDropdown, selectedYear } = this.props;

    return (
      <div
        className={cx('js-dropdown', className)}
        onClick={() => {
          onToggle(id);
        }}
      >
        <div className="c-dropdown -capitalize">
          <span className="dropdown-label">Year</span>
          <span className="dropdown-title">{selectedYear}</span>
          <FiltersDropdown id={id} currentDropdown={currentDropdown} onClickOutside={onToggle}>
            <ul className="dropdown-list -medium">{this.renderOptions()}</ul>
          </FiltersDropdown>
        </div>
      </div>
    );
  }
}

YearsDropdownSelector.propTypes = {
  years: PropTypes.array,
  onToggle: PropTypes.func,
  onSelected: PropTypes.func,
  className: PropTypes.string,
  selectedYear: PropTypes.number,
  currentDropdown: PropTypes.string
};

export default YearsDropdownSelector;
