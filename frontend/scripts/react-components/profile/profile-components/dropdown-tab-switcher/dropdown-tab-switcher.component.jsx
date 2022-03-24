/* eslint-disable camelcase,import/no-extraneous-dependencies,jsx-a11y/no-noninteractive-element-interactions */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Dropdown from 'react-components/shared/dropdown.component';
import Tooltip from 'react-components/shared/help-tooltip/help-tooltip.component';
import Tabs from 'react-components/shared/tabs/tabs.component';
import Heading from 'react-components/shared/heading/heading.component';

import './dropdown-tab-switcher.scss';

class DropdownTabSwitcher extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedIndex: 0
    };
  }

  onSelectTab = (value, selectedIndex) => {
    this.setState({ selectedIndex });
    this.props.onSelectedIndexChange(selectedIndex);
  };

  onValueSelected = value => {
    const { items } = this.props;
    const selectedIndex = items.indexOf(value);
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
            <Heading variant="sans" as="h3" weight="bold" size="md">
              {title}
            </Heading>
            {titleTooltip && <Tooltip text={titleTooltip} />}
          </div>
          {items.length > 1 && (
            <Tabs
              tabs={items}
              testId={testId}
              onSelectTab={this.onSelectTab}
              itemTabRenderer={itemTabRenderer}
              selectedTab={items[selectedIndex]}
            />
          )}
        </div>
        <div className="dropdown-switcher show-for-small">
          <Dropdown
            label={title}
            value={items[selectedIndex]}
            valueList={items}
            onValueSelected={this.onValueSelected}
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
