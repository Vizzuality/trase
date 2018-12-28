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
    titleTooltip: PropTypes.string,
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
      <React.Fragment key={item.id}>
        {item.hasSeparator && <li className="dropdown-item -separator" />}
        <li
          className={cx('dropdown-item', { '-disabled': item.isDisabled })}
          onClick={() => onSelected(item.id)}
        >
          {item.name.toLowerCase()}
          {item.tooltip && <Tooltip constraint="window" text={item.tooltip} />}
        </li>
      </React.Fragment>
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
      titleTooltip,
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
            {titleTooltip && <Tooltip constraint="window" floating text={titleTooltip} />}
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
