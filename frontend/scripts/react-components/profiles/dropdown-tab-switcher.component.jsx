/* eslint-disable camelcase,import/no-extraneous-dependencies,jsx-a11y/no-noninteractive-element-interactions */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Dropdown from 'react-components/shared/dropdown.component';
import Tooltip from 'react-components/shared/help-tooltip.component';
import 'styles/components/profiles/dropdown-tab-switcher.scss';
import Tabs from 'react-components/shared/tabs.component';

class DropdownTabSwitcher extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedIndex: 0
    };
  }

  handleSelect = (_, selectedIndex) => {
    this.setState({ selectedIndex });

    this.props.onSelectedIndexChange(selectedIndex);
  };

  render() {
    const { items, itemTabRenderer, title, titleTooltip, testId } = this.props;
    const { selectedIndex } = this.state;

    return (
      <div className="c-dropdown-tab-switcher" data-test={testId}>
        <div className="tab-switcher hide-for-small">
          <div className="tab-switcher-title" data-test={`${testId}-title`}>
            {title}
            {titleTooltip && <Tooltip text={titleTooltip} />}
          </div>
          <Tabs
            tabs={items}
            onSelectTab={this.handleSelect}
            itemTabRenderer={itemTabRenderer}
            selectedTab={items[selectedIndex]}
          />
        </div>
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
  testId: PropTypes.string,
  title: PropTypes.any,
  titleTooltip: PropTypes.string,
  items: PropTypes.array,
  itemTabRenderer: PropTypes.func,
  onSelectedIndexChange: PropTypes.func
};

export default DropdownTabSwitcher;
