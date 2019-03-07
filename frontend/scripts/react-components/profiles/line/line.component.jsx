/* eslint-disable camelcase,import/no-extraneous-dependencies,jsx-a11y/no-static-element-interactions */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import isFunction from 'lodash/isFunction';
import capitalize from 'lodash/capitalize';
import { event as d3_event, select as d3_select } from 'd3-selection';
import { axisBottom as d3_axis_bottom, axisLeft as d3_axis_left } from 'd3-axis';
import { scaleLinear as d3_scale_linear, scaleTime as d3_scale_time } from 'd3-scale';
import { timeYear as d3_time_year } from 'd3-time';
import { extent as d3_extent } from 'd3-array';
import { area as d3_area, line as d3_line } from 'd3-shape';
import { format as d3_format } from 'd3-format';
import { timeFormat as d3_timeFormat } from 'd3-time-format';

import { LINE_LABEL_HEIGHT } from '../../../constants';
import abbreviateNumber from '../../../utils/abbreviateNumber';
import { translateText } from '../../../utils/transifex';
import Responsive from '../../shared/responsive.hoc';

import './line.scss';

class Line extends Component {
  componentDidMount() {
    this.build();
  }

  componentDidUpdate() {
    this.build();
  }

  getLines() {
    const { lines } = this.props;
    return lines.filter(lineData => lineData.values.some(v => v !== null));
  }

  isSmallChart() {
    return this.props.width < 450;
  }

  getTicksStyle() {
    const { width } = this.props;
    if (this.isSmallChart()) {
      return 'small';
    }
    if (width <= 600) {
      return 'medium';
    }

    return 'normal';
  }

  prepareData(xValues, data) {
    return xValues.map((year, index) => ({
      name: data.name,
      nodeId: data.node_id,
      date: new Date(year, 0),
      value: data.values[index],
      value9: data.value9
    }));
  }

  build() {
    const {
      unit,
      lines,
      style,
      testId,
      xValues,
      onLinkClick,
      year,
      contextId,
      profileType,
      margin,
      ticks,
      settingsHeight,
      lineClassNameCallback,
      showTooltipCallback,
      hideTooltipCallback
    } = this.props;

    const chartMargin = { ...margin };

    const isSmallChart = this.isSmallChart();
    const isTouchDevice = 'ontouchstart' in window; // I know this is not 100% true, but it's good enough

    if (isSmallChart) {
      chartMargin.right = 30;
    }

    const width = this.props.width - chartMargin.left - chartMargin.right;
    const chartHeight = settingsHeight - chartMargin.top - chartMargin.bottom;
    const allYValues = [].concat(...lines.map(line => line.values));

    this.chart.innerHTML = '';
    const d3Container = d3_select(this.chart)
      .append('svg')
      .attr('width', width + chartMargin.left + chartMargin.right)
      .attr('height', chartHeight + chartMargin.top + chartMargin.bottom)
      .style('overflow', 'visible')
      .append('g')
      .attr('transform', `translate(${chartMargin.left},${chartMargin.top})`);

    const x = d3_scale_time()
      .range([0, width])
      .domain(d3_extent(xValues, y => new Date(y, 0)));

    const y = d3_scale_linear()
      .rangeRound([chartHeight, 0])
      .domain(d3_extent([0, ...allYValues]));

    let lastY = chartHeight + LINE_LABEL_HEIGHT;

    const sanitizedLines = this.getLines().sort((a, b) => {
      const last = xValues.length - 1;
      return a.values[last] - b.values[last];
    });
    const numLines = sanitizedLines.length;

    sanitizedLines.forEach((lineData, i) => {
      const lineValuesWithFormat = this.prepareData(xValues, lineData);
      const line = d3_line()
        .defined(d => d.value)
        .x(d => x(d.date))
        .y(d => y(d.value));
      const type = typeof style !== 'undefined' ? style.type : lineData.type;
      const lineStyle = typeof style !== 'undefined' ? style.style : lineData.style;

      let area = null;
      let pathContainers = null;

      // eslint-disable-next-line default-case
      switch (type) {
        case 'area':
          area = d3_area()
            .defined(d => d.value)
            .x(d => x(d.date))
            .y(chartHeight)
            .y1(d => y(d.value));

          d3Container
            .append('path')
            .datum(lineValuesWithFormat)
            .attr('data-test', `${testId}-area`)
            .attr('class', lineStyle)
            .attr('d', area);

          d3Container
            .append('path')
            .datum(lineValuesWithFormat)
            .attr('data-test', `${testId}-area-line`)
            .attr('class', `line-${lineStyle}`)
            .attr('d', line);

          break;

        // following styles don't care about discontinuous blocks for now and will only render the first one
        case 'line':
          d3Container
            .append('path')
            .datum(lineValuesWithFormat)
            .attr('data-test', `${testId}-line`)
            .attr('class', lineStyle)
            .attr('d', line);
          break;

        case 'line-points': {
          const lineNumber = numLines - i;
          pathContainers = d3Container
            .datum(lineValuesWithFormat)
            .append('g')
            .attr('id', lineData.geo_id)
            .attr('data-test', `${testId}-line-points`)
            .attr('class', d => {
              const lineIndex = isSmallChart ? i : d[0].value9;

              return isFunction(lineClassNameCallback)
                ? lineClassNameCallback(lineIndex, lineStyle)
                : lineStyle;
            });

          pathContainers
            .selectAll('path')
            .data(d => [d])
            .enter()
            .append('path')
            .attr('d', line);

          if (!isSmallChart) {
            const texts = pathContainers
              .selectAll('text')
              .data(d => [d])
              .enter()
              .append('g')
              .attr('transform', d => {
                const last = d.length - 1;
                const { value } = d[last];
                let newNumberY = y(value) + 4;
                if (newNumberY + LINE_LABEL_HEIGHT > lastY) {
                  newNumberY = lastY - LINE_LABEL_HEIGHT - 1;
                }
                lastY = newNumberY;
                return `translate(${width + 6},${newNumberY})`;
              });

            texts.append('text').text(`${lineNumber}.`);

            texts
              .append('text')
              .attr('transform', 'translate(16,0)')
              .attr('class', d => {
                if (typeof onLinkClick !== 'undefined' && d[0].nodeId && profileType) {
                  return 'link';
                }
                return '';
              })
              .on('click', d => {
                if (typeof onLinkClick !== 'undefined' && d[0].nodeId && profileType) {
                  onLinkClick(profileType, {
                    contextId,
                    nodeId: d[0].nodeId,
                    year
                  });
                }
              })
              .text(d => `${capitalize(translateText(d[0].name))}`);
          }

          const circles = pathContainers
            .selectAll('circle')
            .data(d => d.filter(dd => dd.value !== null))
            .enter();

          circles
            .append('circle')
            .attr('class', 'small-circle')
            .attr('cx', d => x(d.date))
            .attr('cy', d => y(d.value))
            .attr('r', 2);

          circles
            .append('circle')
            .attr('class', 'hover-circle')
            .attr('cx', d => x(d.date))
            .attr('cy', d => y(d.value))
            .attr('r', 4);

          this.hitboxCircles = circles
            .append('circle')
            .attr('class', 'hitbox-circle')
            .attr('cx', d => x(d.date))
            .attr('cy', d => y(d.value))
            .attr('r', isTouchDevice ? 15 : 4);

          if (showTooltipCallback !== undefined) {
            this.hitboxCircles
              .on('mousemove', d => {
                showTooltipCallback(
                  d,
                  d3_event.clientX + 10,
                  d3_event.clientY + window.scrollY + 10
                );
              })
              .on('mouseout', () => {
                hideTooltipCallback();
              });
          }
          break;
        }
      }
    });

    let yTickFormat = null;
    let xTickFormat = null;
    if (ticks.yTickFormatType === 'top-location') {
      yTickFormat = value => abbreviateNumber(value, 3);

      xTickFormat = value => {
        const format = d3_timeFormat('%Y');
        const formatValue = format(value);
        return this.getTicksStyle() === 'normal'
          ? formatValue
          : `'${formatValue.toString().slice(2)}`;
      };
    } else {
      yTickFormat = (value, idx, arr) => {
        const format = d3_format('0');
        const isLast = idx === arr.length - 1;
        return `${format(value)}${isLast ? unit : ''}`;
      };
      xTickFormat = value => {
        const format = d3_timeFormat('%Y');
        const formatValue = format(value);
        return this.getTicksStyle() === 'normal'
          ? formatValue
          : `'${formatValue.toString().slice(2)}`;
      };
    }

    const xTicks = this.getTicksStyle() === 'small' ? d3_time_year.every(2) : xValues.length;

    const xAxis = d3_axis_bottom(x)
      .ticks(ticks.xTicks || xTicks)
      .tickSize(0)
      .tickPadding(ticks.xTickPadding)
      .tickFormat(xTickFormat);
    const yAxis = d3_axis_left(y)
      .ticks(ticks.yTicks)
      .tickSize(-width, 0)
      .tickPadding(ticks.yTickPadding)
      .tickFormat(yTickFormat);

    d3Container
      .append('g')
      .attr('transform', `translate(0, ${chartHeight} )`)
      .attr('class', 'axis axis--x')
      .call(xAxis);

    d3Container
      .append('g')
      .attr('class', 'axis axis--y axis--deforestation')
      .call(yAxis);
  }

  renderLegend() {
    const {
      xValues,
      onLinkClick,
      year,
      style,
      lineClassNameCallback,
      profileType,
      contextId
    } = this.props;
    const isSmallChart = this.isSmallChart();
    const lines = this.getLines().sort((a, b) => {
      const last = xValues.length - 1;
      return b.values[last] - a.values[last];
    });
    const lineOnMouseEnter = lineData => {
      this.chart.querySelector(`#${lineData.geo_id}`).classList.add('selected');
    };
    const lineOnMouseLeave = lineData => {
      this.chart.querySelector(`#${lineData.geo_id}`).classList.remove('selected');
    };

    return (
      <ul className="line-bottom-legend">
        {lines.map((lineData, index) => {
          const lineStyle = typeof style !== 'undefined' ? style.style : lineData.style;
          const lineIndex = isSmallChart ? lines.length - index - 1 : lineData.value9;
          const lineClassName = isFunction(lineClassNameCallback)
            ? lineClassNameCallback(lineIndex, lineStyle)
            : lineStyle;
          const isLink = typeof onLinkClick !== 'undefined' && lineData.node_id && profileType;
          const linkOnClick = () => {
            onLinkClick(profileType, {
              contextId,
              nodeId: lineData.node_id,
              year
            });
          };

          return (
            <li
              key={index}
              onMouseEnter={() => lineOnMouseEnter(lineData)}
              onMouseLeave={() => lineOnMouseLeave(lineData)}
            >
              <svg height="6" width="20" className="line-color">
                <g className={lineClassName}>
                  <path d="M0 3 20 3" />
                </g>
              </svg>
              <span>{index + 1}.</span>
              {isLink ? (
                <span className="link" onClick={linkOnClick}>
                  {capitalize(translateText(lineData.name))}
                </span>
              ) : (
                <span>{capitalize(translateText(lineData.name))}</span>
              )}
            </li>
          );
        })}
      </ul>
    );
  }

  render() {
    const { testId } = this.props;
    return (
      <div className="c-line" data-test={testId}>
        <div
          ref={elem => {
            this.chart = elem;
          }}
        />
        {this.props.useBottomLegend && this.isSmallChart() && this.renderLegend()}
      </div>
    );
  }
}

Line.propTypes = {
  testId: PropTypes.string,
  profileType: PropTypes.string,
  lines: PropTypes.array,
  unit: PropTypes.string,
  style: PropTypes.object,
  onLinkClick: PropTypes.func,
  width: PropTypes.number,
  contextId: PropTypes.number,
  xValues: PropTypes.array,
  useBottomLegend: PropTypes.bool,
  year: PropTypes.number,
  margin: PropTypes.object,
  ticks: PropTypes.object,
  settingsHeight: PropTypes.number,
  lineClassNameCallback: PropTypes.func,
  showTooltipCallback: PropTypes.func,
  hideTooltipCallback: PropTypes.func
};

export default Responsive()(Line);
