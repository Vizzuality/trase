/* eslint-disable camelcase,import/no-extraneous-dependencies,jsx-a11y/no-noninteractive-element-interactions */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import Dropdown from 'react-components/shared/dropdown.component';
import Tooltip from 'react-components/shared/help-tooltip.component';
import 'styles/components/profiles/dropdown-tab-switcher.scss';

class DropdownTabSwitcher extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedIndex: 0
    };
  }

  handleSelect(selectedIndex) {
    this.setState({ selectedIndex });

    this.props.onSelectedIndexChange(selectedIndex);
  }

  render() {
    const { items, itemTabRenderer, title, titleTooltip } = this.props;
    const { selectedIndex } = this.state;

    return (
      <div className="c-dropdown-tab-switcher">
        <ul className="tab-switcher hide-for-small">
          <li className="tab-switcher-title">
            {title}
            {titleTooltip && <Tooltip text={titleTooltip} />}
          </li>

          {items.map((item, index) => (
            <li
              key={index}
              className={classnames('tab', {
                selected: index === selectedIndex
              })}
              data-key={item}
              onClick={() => this.handleSelect(index)}
            >
              {itemTabRenderer ? itemTabRenderer(item, index) : item}
            </li>
          ))}
        </ul>
        <div className="dropdown-switcher show-for-small">
          <Dropdown
            label={title}
            value={items[selectedIndex]}
            valueList={items}
            onValueSelected={s => this.handleSelect(items.indexOf(s))}
          />
        </div>
      </div>
    );
  }
}

DropdownTabSwitcher.propTypes = {
  title: PropTypes.string,
  titleTooltip: PropTypes.string,
  items: PropTypes.array,
  itemTabRenderer: PropTypes.func,
  onSelectedIndexChange: PropTypes.func
};

export default DropdownTabSwitcher;
