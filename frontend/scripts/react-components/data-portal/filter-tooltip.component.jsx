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
    this.filterOptions = indicator.filterOptions.map(o => FILTER_OPTIONS_MAP[o]);

    this.state = {
      selectedFilter: this.filterOptions[0],
      selectedValue: 0
    };

    this.handleFilterChange = this.handleFilterChange.bind(this);
    this.handleValueChange = this.handleValueChange.bind(this);
  }

  componentDidMount() {
    this.initTooltip();
  }

  componentWillUnmount() {
    this.destroyTooltip();
  }

  handleFilterChange(filter) {
    this.setState({
      selectedFilter: filter
    });
  }

  handleValueChange(event) {
    this.setState({
      selectedValue: event.target.value
    });
  }

  initTooltip() {
    this.tooltip = new Tooltip(this.element, {
      title: this.contentElement,
      placement: 'top',
      container: 'body',
      boundariesElement: 'window',
      offset: '1, 1',
      template:
        '<div class="tooltip download-filters"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
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

  renderTooltipContent() {
    const { selectedFilter, selectedValue } = this.state;
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
            valueList={this.filterOptions}
            onValueSelected={this.handleFilterChange}
          />
          <input type="number" value={selectedValue} onChange={this.handleValueChange} />
          {indicator.unit}
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
        className="tooltip-react"
      >
        <svg className="icon tooltip-react-icon">
          <use xlinkHref="#icon-layer-info" />
        </svg>

        {this.renderTooltipContent()}
      </div>
    );
  }
}

FilterTooltipComponent.propTypes = {
  indicator: PropTypes.any
};
