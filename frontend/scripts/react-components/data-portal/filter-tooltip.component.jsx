/* eslint-disable jsx-a11y/no-static-element-interactions,jsx-a11y/no-noninteractive-element-interactions jsx-a11y/mouse-events-have-key-events */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import get from 'lodash/get';
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

    this.valueFormat = value => FILTER_OPTIONS_MAP[value];
    this.tooltipElement = null;

    this.handleBodyClick = this.handleBodyClick.bind(this);
    this.handleDropdownValueChange = this.handleDropdownValueChange.bind(this);
    this.handleFilterIconClick = this.handleFilterIconClick.bind(this);
    this.handleInputValueChange = this.handleInputValueChange.bind(this);
    this.handleOperationChange = this.handleOperationChange.bind(this);
  }

  componentDidMount() {
    this.initTooltip();
    document.body.addEventListener('click', this.handleBodyClick);
  }

  componentWillUnmount() {
    this.destroyTooltip();
    document.body.removeEventListener('click', this.handleBodyClick);
  }

  setDefaultFilter() {
    const { indicator } = this.props;
    const op = get(indicator, 'filterOptions.ops[0]', undefined);
    const val = get(indicator, 'filterOptions.values[0]', 0);

    this.changeFilter({ op, val });
  }

  handleBodyClick() {
    if (this.tooltip) {
      this.tooltip.hide();
      this.destroyTooltipVeil();
    }
  }

  handleDropdownValueChange(val) {
    this.changeFilter({ val });
  }

  handleFilterIconClick() {
    if (!this.props.selectedFilter) {
      this.setDefaultFilter();
    }
    this.tooltip.show();
    this.createTooltipVeil();
  }

  handleInputValueChange(event) {
    this.changeFilter({ val: event.target.value });
  }

  handleOperationChange(op) {
    this.changeFilter({ op });
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
      template:
        '<div class="tooltip filter-tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
      trigger: 'manual',
      html: true
    });

    // workaround for ios not closing tooltips
    const iOS = /iPhone|iPad|iPod/.test(navigator.platform) && !window.MSStream;
    if (iOS) {
      document.body.classList.add('tooltip-ios-touch');
    }
  }

  createTooltipVeil() {
    const veil = document.createElement('div');
    veil.classList.add('veil');
    document.body.appendChild(veil);
    this.tooltip._veil = veil;
  }

  destroyTooltip() {
    if (this.tooltip) {
      this.destroyTooltipVeil();
      this.tooltip.dispose();
    }
  }

  destroyTooltipVeil() {
    if (this.tooltip && this.tooltip._veil) {
      document.body.removeChild(this.tooltip._veil);
      this.tooltip._veil = null;
    }
  }

  renderValueInput() {
    const { indicator, selectedFilter } = this.props;

    if (!selectedFilter) return null;

    if (indicator.filterOptions.values) {
      return (
        <Dropdown
          value={selectedFilter.val}
          valueList={indicator.filterOptions.values}
          onValueSelected={this.handleDropdownValueChange}
        />
      );
    }

    return (
      <React.Fragment>
        <input type="number" value={selectedFilter.val} onChange={this.handleInputValueChange} />
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
            value={selectedFilter && selectedFilter.op}
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
        className={cx('tooltip-react filter-tooltip', { '-selected': this.props.selectedFilter })}
        onClick={this.handleFilterIconClick}
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
  selectedFilter: PropTypes.shape({
    name: PropTypes.string,
    op: PropTypes.string,
    val: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  }),
  onChange: PropTypes.func
};
