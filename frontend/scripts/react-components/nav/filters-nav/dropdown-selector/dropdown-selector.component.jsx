/* eslint-disable jsx-a11y/no-static-element-interactions,jsx-a11y/no-noninteractive-element-interactions */
import React, { Component } from 'react';
import FiltersDropdown from 'react-components/nav/filters-nav/filters-dropdown.component';
import cx from 'classnames';
import PropTypes from 'prop-types';
import Tooltip from 'react-components/shared/help-tooltip/help-tooltip.component';

class DropdownSelector extends Component {
  static defaultProps = {
    id: 'dropdown-selector',
    dropdownClassName: '-capitalize'
  };

  static propTypes = {
    id: PropTypes.string,
    items: PropTypes.array,
    label: PropTypes.string,
    onToggle: PropTypes.func,
    tooltip: PropTypes.string,
    onSelected: PropTypes.func,
    className: PropTypes.string,
    selectedItem: PropTypes.object,
    listClassName: PropTypes.string,
    titleClassName: PropTypes.string,
    currentDropdown: PropTypes.string,
    dropdownClassName: PropTypes.string
  };

  renderItems() {
    const { onSelected, items } = this.props;
    return items.map(item => (
      <li
        key={item.id}
        className={cx('dropdown-item', { '-disabled': item.isDisabled })}
        onClick={() => onSelected(item.id)}
      >
        {item.name.toLowerCase()}
      </li>
    ));
  }

  render() {
    const {
      className,
      onToggle,
      currentDropdown,
      selectedItem,
      id,
      label,
      tooltip,
      dropdownClassName,
      titleClassName,
      listClassName
    } = this.props;

    return (
      <div className={cx('js-dropdown', className)} onClick={() => onToggle(id)}>
        <div className={cx('c-dropdown', dropdownClassName)}>
          <span className="dropdown-label">
            {label}
            {tooltip && <Tooltip text={tooltip} constraint="window" />}
          </span>
          <span className={cx('dropdown-title', titleClassName)}>
            {selectedItem.name.toLowerCase()}
          </span>
          <FiltersDropdown id={id} currentDropdown={currentDropdown} onClickOutside={onToggle}>
            <ul className={cx('dropdown-list', listClassName)}>{this.renderItems()}</ul>
          </FiltersDropdown>
        </div>
      </div>
    );
  }
}

export default DropdownSelector;
