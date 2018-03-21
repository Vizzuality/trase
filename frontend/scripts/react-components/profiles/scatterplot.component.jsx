/* eslint-disable camelcase,import/no-extraneous-dependencies,jsx-a11y/no-noninteractive-element-interactions */
import { event as d3_event, select as d3_select } from 'd3-selection';
import { axisBottom as d3_axis_bottom, axisLeft as d3_axis_left } from 'd3-axis';
import { scaleLinear as d3_scale_linear } from 'd3-scale';
import { extent as d3_extent } from 'd3-array';
import 'd3-transition';

import 'styles/components/profiles/scatterplot.scss';
import abbreviateNumber from 'utils/abbreviateNumber';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Responsive } from 'react-components/shared/responsive.hoc';
import DropdownTabSwitcher from 'react-components/profiles/dropdown-tab-switcher.component';

class Scatterplot extends Component {
  constructor(props) {
    super(props);

    this.margins = {
      top: 20,
      right: 13,
      bottom: 30,
      left: 29
    };
    this.state = {
      selectedTabIndex: 0
    };

    this.handleSwitcherIndexChange = this.handleSwitcherIndexChange.bind(this);
  }

  componentDidMount() {
    this.build();
  }

  componentDidUpdate(prevProps) {
    const shouldRebuild =
      prevProps.year !== this.props.year || prevProps.width !== this.props.width;

    if (shouldRebuild) {
      this.build();
    }
  }

  build() {
    const { data, showTooltipCallback, hideTooltipCallback } = this.props;
    const parentWidth = this.props.width;

    const width = parentWidth - this.margins.left - this.margins.right;
    const height = 377 - this.margins.top - this.margins.bottom;
    const allYValues = data.map(item => item.y);
    const allXValues = data.map(item => item.x[this.state.selectedTabIndex]);

    this.x = d3_scale_linear()
      .range([0, width])
      .domain(d3_extent([0, ...allXValues]));

    this.y = d3_scale_linear()
      .range([height, 0])
      .domain(d3_extent([0, ...allYValues]));

    this.xAxis = d3_axis_bottom(this.x)
      .ticks(8)
      .tickSize(-height, 0)
      .tickPadding(9)
      .tickFormat((value, i) => {
        if (i === 0) {
          return null;
        }

        return abbreviateNumber(value, 3);
      });

    this.yAxis = d3_axis_left(this.y)
      .ticks(7)
      .tickSize(-width, 0)
      .tickPadding(9)
      .tickFormat(value => abbreviateNumber(value, 3));

    this.svgElement.innerHTML = '';

    this.svg = d3_select(this.svgElement)
      .attr('width', parentWidth)
      .attr('height', height + this.margins.top + this.margins.bottom)
      .append('g')
      .attr('transform', `translate(${this.margins.left},${this.margins.top})`);

    this.svg
      .append('g')
      .attr('class', 'axis axis--x')
      .attr('transform', `translate(0,${height})`)
      .call(this.xAxis);

    this.svg
      .append('g')
      .attr('class', 'axis axis-line')
      .attr('transform', `translate(0,${height})`)
      .call(
        d3_axis_bottom(this.x)
          .ticks(0)
          .tickSizeOuter(0)
      );

    this.svg
      .append('g')
      .attr('class', 'axis axis--y')
      .call(this.yAxis);

    this.svg
      .append('g')
      .attr('class', 'axis axis-line')
      .call(
        d3_axis_left(this.y)
          .ticks(0)
          .tickSizeOuter(0)
      );

    this.circles = this.svg
      .selectAll('circle')
      .data(this._getFormattedData(this.state.selectedTabIndex))
      .enter()
      .append('circle')
      .attr('class', d => this._getCircleClass(d))
      .attr('r', 5)
      .attr('cx', d => this.x(d.x))
      .attr('cy', d => this.y(d.y));

    if (showTooltipCallback !== undefined) {
      this.circles
        .on('mousemove', d => {
          const selectedSwitcher = document.querySelector(
            '.c-scatterplot .tab-switcher li.selected span'
          );

          showTooltipCallback(
            d,
            {
              name: selectedSwitcher.innerHTML,
              unit: selectedSwitcher.getAttribute('data-unit')
            },
            d3_event.clientX + 10,
            d3_event.clientY + window.scrollY + 10
          );
        })
        .on('mouseout', () => {
          hideTooltipCallback();
        });
    }
  }

  handleSwitcherIndexChange(selectedTabIndex) {
    this.setState({ selectedTabIndex });

    const newData = this._getFormattedData(selectedTabIndex);
    const allXValues = newData.map(item => item.x);
    const x = d3_scale_linear()
      .range([0, this.props.width - this.margins.left - this.margins.right])
      .domain(d3_extent([0, ...allXValues]));
    this.xAxis.scale(x);

    this.circles
      .data(newData)
      .transition()
      .duration(700)
      .attr('cx', d => x(d.x))
      .attr(
        'class',
        d => (d.x === null ? `${this._getCircleClass(d)} -hidden` : this._getCircleClass(d))
      );

    this.svg
      .select('.axis--x')
      .transition()
      .duration(500)
      .call(this.xAxis);
  }

  _getFormattedData(i) {
    return this.props.data.map(item => ({
      nodeId: item.id,
      name: item.name,
      y: item.y,
      x: item.x[i]
    }));
  }

  _getCircleClass(d) {
    return d.name.toUpperCase() === this.props.node.name.toUpperCase() ? 'dot current' : 'dot';
  }

  render() {
    const { title, xDimension } = this.props;
    const tabs = xDimension.filter((x, i) => i < 3);
    const itemTabRenderer = (_, index) => {
      const elem = tabs[index];
      return <span data-unit={elem.unit !== null ? elem.unit : null}>{elem.name}</span>;
    };

    return (
      <div className="c-scatterplot">
        <DropdownTabSwitcher
          title={title}
          items={tabs.map(e => e.name)}
          itemTabRenderer={itemTabRenderer}
          onSelectedIndexChange={this.handleSwitcherIndexChange}
        />
        <div className="js-companies-exporting-y-axis axis-legend" />
        <div className="js-companies-exporting">
          <svg
            ref={el => {
              this.svgElement = el;
            }}
          />
        </div>
      </div>
    );
  }
}

Scatterplot.propTypes = {
  title: PropTypes.string,
  data: PropTypes.array,
  node: PropTypes.object,
  xDimension: PropTypes.array,
  year: PropTypes.number,
  width: PropTypes.number,
  showTooltipCallback: PropTypes.func,
  hideTooltipCallback: PropTypes.func
};

export default Responsive()(Scatterplot);
