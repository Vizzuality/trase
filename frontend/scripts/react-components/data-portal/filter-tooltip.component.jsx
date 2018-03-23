/* eslint-disable jsx-a11y/mouse-events-have-key-events */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Tooltip from 'tooltip.js';
import get from 'lodash/get';

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

    this.valueFormat = value => FILTER_OPTIONS_MAP[value];
    this.tooltipElement = null;

    this.setDefaultFilter();

    this.handleDropdownValueChange = this.handleDropdownValueChange.bind(this);
    this.handleInputValueChange = this.handleInputValueChange.bind(this);
    this.handleOperationChange = this.handleOperationChange.bind(this);
  }

  componentDidMount() {
    this.initTooltip();
  }

  componentWillUnmount() {
    this.destroyTooltip();
  }

  setDefaultFilter() {
    const { indicator } = this.props;
    const op = get(indicator, 'filterOptions.ops[0]', undefined);
    const value = get(indicator, 'filterOptions.values[0]', 0);

    this.changeFilter({ op, value });
  }

  handleOperationChange(op) {
    this.changeFilter({ op });
  }

  handleInputValueChange(event) {
    this.changeFilter({ value: event.target.value });
  }

  handleDropdownValueChange(value) {
    this.changeFilter({ value });
  }

  changeFilter(filter) {
    const { indicator, selectedFilter, onChange } = this.props;

    if (onChange) {
      onChange({
        name: indicator.id,
        ...selectedFilter,
        ...filter
      });
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
    const { indicator, selectedFilter } = this.props;

    if (indicator.filterOptions.values) {
      return (
        <Dropdown
          value={selectedFilter.value}
          valueList={indicator.filterOptions.values}
          onValueSelected={this.handleDropdownValueChange}
        />
      );
    }

    return (
      <React.Fragment>
        <input type="number" value={selectedFilter.value} onChange={this.handleInputValueChange} />
        {indicator.unit}
      </React.Fragment>
    );
  }

  renderTooltipContent() {
    const { indicator, selectedFilter } = this.props;

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
            value={selectedFilter.op}
            valueFormat={this.valueFormat}
            valueList={indicator.filterOptions.ops}
            onValueSelected={this.handleOperationChange}
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

FilterTooltipComponent.defaultProps = {
  selectedFilter: {
    value: 0
  }
};

FilterTooltipComponent.propTypes = {
  indicator: PropTypes.any,
  selectedFilter: PropTypes.shape({
    name: PropTypes.string,
    op: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  }),
  onChange: PropTypes.func
};
