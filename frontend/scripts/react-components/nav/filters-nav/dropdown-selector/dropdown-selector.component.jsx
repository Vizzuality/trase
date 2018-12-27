/* eslint-disable jsx-a11y/no-static-element-interactions,jsx-a11y/no-noninteractive-element-interactions */
import React, { Component } from 'react';
import FiltersDropdown from 'react-components/nav/filters-nav/filters-dropdown.component';
import cx from 'classnames';
import PropTypes from 'prop-types';

class YearsDropdownSelector extends Component {
  static defaultProps = {
    id: 'dropdown-selector'
  };

  static propTypes = {
    id: PropTypes.string,
    items: PropTypes.array,
    label: PropTypes.string,
    onToggle: PropTypes.func,
    onSelected: PropTypes.func,
    className: PropTypes.string,
    selectedItem: PropTypes.object,
    currentDropdown: PropTypes.string
  };

  renderItems() {
    const { onSelected, items } = this.props;
    return items.map(item => (
      <li key={item.id} className={cx('dropdown-item')} onClick={() => onSelected(item.id)}>
        {item.name}
      </li>
    ));
  }

  render() {
    const { className, onToggle, currentDropdown, selectedItem, id, label } = this.props;

    return (
      <div className={cx('js-dropdown', className)} onClick={() => onToggle(id)}>
        <div className="c-dropdown -capitalize">
          <span className="dropdown-label">{label}</span>
          <span className="dropdown-title">{selectedItem.name}</span>
          <FiltersDropdown id={id} currentDropdown={currentDropdown} onClickOutside={onToggle}>
            <ul className="dropdown-list -medium">{this.renderItems()}</ul>
          </FiltersDropdown>
        </div>
      </div>
    );
  }
}

export default YearsDropdownSelector;
