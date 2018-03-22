/* eslint-disable jsx-a11y/mouse-events-have-key-events */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Tooltip from 'tooltip.js';
import Dropdown from 'react-components/shared/dropdown.component';

import 'styles/components/data/filter-tooltip.scss';

const FILTER_OPTIONS_MAP = {
  lt: 'lower than',
  gt: 'greater than',
  eq: 'equals'
};

export default class FilterTooltipComponent extends Component {
  constructor(props) {
    super(props);

    const { indicator } = this.props;

    this.state = {
      selectedFilter: indicator.filterOptions.ops[0],
      selectedValue: indicator.filterOptions.values ? indicator.filterOptions.values[0] : 0
    };

    this.valueFormat = value => FILTER_OPTIONS_MAP[value];
    this.handleFilterChange = this.handleFilterChange.bind(this);
    this.handleInputValueChange = this.handleInputValueChange.bind(this);
    this.handleDropdownValueChange = this.handleDropdownValueChange.bind(this);
  }

  componentDidMount() {
    this.initTooltip();
  }

  componentWillUnmount() {
    this.destroyTooltip();
  }

  handleFilterChange(filter) {
    this.setState(
      {
        selectedFilter: filter
      },
      this.handleStateChange
    );
  }

  handleInputValueChange(event) {
    this.setState(
      {
        selectedValue: event.target.value
      },
      this.handleStateChange
    );
  }

  handleDropdownValueChange(value) {
    this.setState(
      {
        selectedValue: value
      },
      this.handleStateChange
    );
  }

  handleStateChange() {
    const { onChange, indicator } = this.props;
    const { selectedFilter, selectedValue } = this.state;

    if (onChange) {
      onChange({ name: indicator.id, op: selectedFilter, value: selectedValue });
    }
  }

  initTooltip() {
    this.tooltip = new Tooltip(this.element, {
      title: this.contentElement,
      placement: 'top',
      container: 'body',
      boundariesElement: 'window',
      offset: '1, 1',
      template:
        '<div class="tooltip filter-tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
      trigger: 'click',
      html: true
    });

    // workaround for ios not closing tooltips
    const iOS = /iPhone|iPad|iPod/.test(navigator.platform) && !window.MSStream;
    if (iOS) {
      document.body.classList.add('tooltip-ios-touch');
    }
  }

  destroyTooltip() {
    if (this.tooltip) {
      this.tooltip.dispose();
    }
  }

  renderValueInput() {
    const { selectedValue } = this.state;
    const { indicator } = this.props;

    if (indicator.filterOptions.values) {
      return (
        <Dropdown
          value={selectedValue}
          valueList={indicator.filterOptions.values}
          onValueSelected={this.handleDropdownValueChange}
        />
      );
    }

    return (
      <React.Fragment>
        <input type="number" value={selectedValue} onChange={this.handleInputValueChange} />
        {indicator.unit}
      </React.Fragment>
    );
  }

  renderTooltipContent() {
    const { selectedFilter } = this.state;
    const { indicator } = this.props;

    return (
      <div
        className="tooltip-content"
        ref={elem => {
          this.contentElement = elem;
        }}
      >
        <div className="title">FILTER INDICATOR</div>
        <div className="content">
          {indicator.filterName}
          <Dropdown
            value={selectedFilter}
            valueFormat={this.valueFormat}
            valueList={indicator.filterOptions.ops}
            onValueSelected={this.handleFilterChange}
          />
          {this.renderValueInput()}
        </div>
      </div>
    );
  }

  render() {
    return (
      <div
        ref={elem => {
          this.element = elem;
        }}
        className="tooltip-react filter-tooltip"
      >
        <svg className="icon tooltip-react-icon">
          <use xlinkHref="#icon-filter" />
        </svg>

        {this.renderTooltipContent()}
      </div>
    );
  }
}

FilterTooltipComponent.propTypes = {
  indicator: PropTypes.any,
  onChange: PropTypes.func
};
