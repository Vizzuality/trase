/* eslint-disable jsx-a11y/no-static-element-interactions, jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/mouse-events-have-key-events */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import get from 'lodash/get';
import Tooltip from 'tooltip.js';
import AutosizeInput from 'react-input-autosize';
import Text from 'react-components/shared/text/text.component';
import Dropdown from 'react-components/shared/dropdown.component';

import './filter-tooltip.scss';

const FILTER_OPTIONS_MAP = {
  lt: 'lower than',
  gt: 'greater than',
  eq: 'equals'
};

// Tooltip only for downloads
export default class FilterTooltipComponent extends Component {
  constructor(props) {
    super(props);

    this.valueRenderer = value => FILTER_OPTIONS_MAP[value];
    this.tooltipElement = null;
    this.tooltip = null;
    this.tooltipVeil = null;

    this.handleBodyClick = this.handleBodyClick.bind(this);
    this.handleDropdownValueChange = this.handleDropdownValueChange.bind(this);
    this.handleFilterIconClick = this.handleFilterIconClick.bind(this);
    this.handleInputValueChange = this.handleInputValueChange.bind(this);
    this.handleOperationChange = this.handleOperationChange.bind(this);
    this.handleFilterClearClick = this.handleFilterClearClick.bind(this);
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

    const options = get(indicator, 'filterOptions.ops', []);
    const op = options.includes('gt') ? 'gt' : options[0];
    const val = get(indicator, 'filterOptions.values[0]', 0);

    this.changeFilter({ op, val });
  }

  handleBodyClick(event) {
    if (this.contentElement.contains(event.target)) return;
    this.closeTooltip();
  }

  handleDropdownValueChange(val) {
    this.changeFilter({ val });
  }

  handleFilterClearClick() {
    const { onClear, indicator } = this.props;
    this.closeTooltip();
    if (onClear) onClear(indicator.id);
  }

  handleFilterIconClick() {
    if (!this.props.selectedFilter) {
      this.setDefaultFilter();
    }
    this.tooltip.show();
    this.createTooltipVeil();
    this.forceUpdate(); // rerender autosize input
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
    this.tooltipVeil = veil;
  }

  closeTooltip() {
    if (!this.tooltip) return;
    this.tooltip.hide();
    this.destroyTooltipVeil();
  }

  destroyTooltip() {
    if (!this.tooltip) return;
    this.destroyTooltipVeil();
    this.tooltip.dispose();
  }

  destroyTooltipVeil() {
    if (this.tooltipVeil) {
      document.body.removeChild(this.tooltipVeil);
      this.tooltipVeil = null;
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
        <AutosizeInput
          type="number"
          minWidth="30"
          value={selectedFilter.val}
          onChange={this.handleInputValueChange}
        />
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
        <div className="title">
          <Text as="span" variant="mono">
            FILTER INDICATOR
          </Text>
          <button className="clear-filter" onClick={this.handleFilterClearClick}>
            <Text as="span" variant="mono" color="grey-faded">
              DELETE
            </Text>
            <svg className="icon">
              <use xlinkHref="#icon-delete" />
            </svg>
          </button>
        </div>
        <div className="content">
          {indicator.filterName}
          <Dropdown
            value={selectedFilter && selectedFilter.op}
            valueRenderer={this.valueRenderer}
            valueList={indicator.filterOptions.ops}
            onValueSelected={this.handleOperationChange}
          />
          {this.renderValueInput()}
        </div>
      </div>
    );
  }

  render() {
    const filterIcon = this.props.selectedFilter ? 'filter-filled' : 'filter';

    return (
      <div
        ref={elem => {
          this.element = elem;
        }}
        className={cx('tooltip-react filter-tooltip', { '-selected': this.props.selectedFilter })}
      >
        <svg className="icon tooltip-react-icon" onClick={this.handleFilterIconClick}>
          <use xlinkHref={`#icon-${filterIcon}`} />
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
  onChange: PropTypes.func,
  onClear: PropTypes.func
};
