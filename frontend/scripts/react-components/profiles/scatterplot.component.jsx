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
import classnames from 'classnames';

class Scatterplot extends Component {
  constructor(props) {
    super(props);

    this.margins = {
      top: 20, right: 13, bottom: 30, left: 29
    };
    this.key = `scatterplot_${new Date().getTime()}`;
    this.state = {
      selectedTabIndex: 0
    };
  }

  componentDidMount() {
    this.build();
  }

  componentDidUpdate(prevProps) {
    this.build(prevProps.year);
  }

  build(prevYear = null) {
    // TODO: this is a very nice hack, that makes sure we only reload the whole chart on year change.
    // It's needed so that react doesn't trigger a full re-render of the d3 elements, and the transition can be shown
    if (prevYear && this.props.year === prevYear) return;

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

    const svgElement = document.querySelector(`.${this.key}`);
    svgElement.innerHTML = '';

    this.svg = d3_select(svgElement)
      .attr('width', parentWidth)
      .attr('height', height + this.margins.top + this.margins.bottom)
      .append('g')
      .attr('transform', `translate(${this.margins.left},${this.margins.top})`);

    this.svg.append('g')
      .attr('class', 'axis axis--x')
      .attr('transform', `translate(0,${height})`)
      .call(this.xAxis);

    this.svg.append('g')
      .attr('class', 'axis axis-line')
      .attr('transform', `translate(0,${height})`)
      .call(d3_axis_bottom(this.x)
        .ticks(0)
        .tickSizeOuter(0));

    this.svg.append('g')
      .attr('class', 'axis axis--y')
      .call(this.yAxis);

    this.svg.append('g')
      .attr('class', 'axis axis-line')
      .call(d3_axis_left(this.y)
        .ticks(0)
        .tickSizeOuter(0));

    this.circles = this.svg.selectAll('circle')
      .data(this._getFormattedData(this.state.selectedTabIndex))
      .enter()
      .append('circle')
      .attr('class', d => this._getCircleClass(d))
      .attr('r', 5)
      .attr('cx', d => this.x(d.x))
      .attr('cy', d => this.y(d.y));

    if (showTooltipCallback !== undefined) {
      this.circles.on('mousemove', (d) => {
        const selectedSwitcher = document.querySelector('.js-scatterplot-switcher-item.selected span');

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

  _switchTab(selectedTabIndex) {
    this.setState({ selectedTabIndex });

    const newData = this._getFormattedData(selectedTabIndex);
    const allXValues = newData.map(item => item.x);
    const x = d3_scale_linear()
      .range([0, this.props.width])
      .domain(d3_extent([0, ...allXValues]));
    this.xAxis.scale(x);

    this.circles
      .data(newData)
      .transition()
      .duration(700)
      .attr('cx', d => x(d.x))
      .attr('class', d => (d.x === null ? `${this._getCircleClass(d)} -hidden` : this._getCircleClass(d)));

    this.svg.select('.axis--x')
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

  renderSwitcher() {
    const tabs = this.props.xDimension.filter((x, i) => i < 3);

    return (
      <ul className="c-scatterplot-switcher js-scatterplot-switcher">
        {tabs.map((elem, index) => (
          <li
            key={index}
            className={classnames(
              'js-scatterplot-switcher-item',
              'tab',
              { selected: index === this.state.selectedTabIndex },
              { unit: elem.unit !== null }
            )}
            data-key={index}
            onClick={() => this._switchTab(index)}
          >
            <span
              data-unit={elem.unit !== null ? elem.unit : null}
            >
              {elem.name}
            </span>
          </li>
        ))}
      </ul>
    );
  }

  render() {
    const { verbGerund, year } = this.props;

    return (
      <div
        className="small-12 columns"
        style={{ position: 'relative' }}
      >
        <h3 className="js-scatterplot-title title -small">
          {`Comparing companies ${verbGerund} Soy from Brazil in ${year}`}
        </h3>
        <div className="js-companies-exporting-y-axis axis-legend" />
        <div className="js-companies-exporting" >
          <svg className={this.key} />
        </div>
        {this.renderSwitcher()}
      </div>
    );
  }
}

Scatterplot.propTypes = {
  data: PropTypes.array,
  node: PropTypes.object,
  xDimension: PropTypes.array,
  verbGerund: PropTypes.string,
  year: PropTypes.number,
  width: PropTypes.number,
  showTooltipCallback: PropTypes.func,
  hideTooltipCallback: PropTypes.func
};

export default Scatterplot;
