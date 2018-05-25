/* eslint-disable camelcase,import/no-extraneous-dependencies,jsx-a11y/no-static-element-interactions */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import isFunction from 'lodash/isFunction';
import capitalize from 'lodash/capitalize';
import { event as d3_event, select as d3_select } from 'd3-selection';
import { axisBottom as d3_axis_bottom, axisLeft as d3_axis_left } from 'd3-axis';
import { scaleLinear as d3_scale_linear, scaleTime as d3_scale_time } from 'd3-scale';
import { extent as d3_extent } from 'd3-array';
import { area as d3_area, line as d3_line } from 'd3-shape';
import { format as d3_format } from 'd3-format';
import { timeFormat as d3_timeFormat } from 'd3-time-format';

import { LINE_LABEL_HEIGHT } from 'constants';
import abbreviateNumber from 'utils/abbreviateNumber';
import i18n from 'utils/transifex';
import { Responsive } from 'react-components/shared/responsive.hoc';

import 'styles/components/profiles/line.scss';

class Line extends Component {
  componentDidMount() {
    this.build();
  }

  componentDidUpdate() {
    this.build();
  }

  getLines() {
    const { data } = this.props;

    return [...data.lines].filter(lineData => lineData.values.filter(v => v !== null).length);
  }

  isSmallChart() {
    return this.props.width < 450;
  }

  prepareData(xValues, data) {
    const continuousValues = xValues.map((year, index) => ({
      name: data.name,
      nodeId: data.node_id,
      profileType: data.profile_type,
      date: new Date(year, 0),
      value: data.values[index],
      value9: data.value9
    }));

    // break down data into discontinuous blocks when data is missing, to avoid
    // having the impression values is zero while it's actually unknown
    const discontinuousValues = [[]];
    continuousValues.forEach((point, i) => {
      if (i > 0) {
        const prevPoint = continuousValues[i - 1];
        if (
          (prevPoint.value === null && point.value !== null) ||
          (prevPoint.value !== null && point.value === null)
        ) {
          discontinuousValues.push([]);
        }
      }
      discontinuousValues[discontinuousValues.length - 1].push(point);
    });

    // get rid of blocks composed of only nulls
    return discontinuousValues.filter(points => points.filter(p => p.value !== null).length);
  }

  build() {
    const { data, xValues, settings, onLinkClick, targetLink, year } = this.props;

    const { ticks } = settings;
    const margin = { ...settings.margin };

    const isSmallChart = this.isSmallChart();

    if (isSmallChart) {
      margin.right = 30;
    }

    const width = this.props.width - margin.left - margin.right;
    const height = settings.height - margin.top - margin.bottom;
    this.showTooltipCallback = settings.showTooltipCallback;
    this.hideTooltipCallback = settings.hideTooltipCallback;
    // const allYValues = [].concat.apply([], data.lines.map(line => line.values));
    const allYValues = [].concat(...data.lines.map(line => line.values));

    this.chart.innerHTML = '';
    const d3Container = d3_select(this.chart)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3_scale_time()
      .range([0, width])
      .domain(d3_extent(xValues, y => new Date(y, 0)));

    const y = d3_scale_linear()
      .rangeRound([height, 0])
      .domain(d3_extent([0, ...allYValues]));

    let lastNumberY = height + LINE_LABEL_HEIGHT;
    let lastNameY = height + LINE_LABEL_HEIGHT;

    const lines = this.getLines().sort((a, b) => {
      const last = xValues.length - 1;
      return a.values[last] - b.values[last];
    });
    const numLines = lines.length;

    lines.forEach((lineData, i) => {
      const lineValuesWithFormat = this.prepareData(xValues, lineData);
      const line = d3_line()
        .x(d => x(d.date))
        .y(d => y(d.value));
      const type = typeof data.style !== 'undefined' ? data.style.type : lineData.type;
      const style = typeof data.style !== 'undefined' ? data.style.style : lineData.style;

      let area = null;
      let pathContainers = null;

      // eslint-disable-next-line default-case
      switch (type) {
        case 'area':
          area = d3_area()
            .x(d => x(d.date))
            .y(height)
            .y1(d => y(d.value));

          // loop through broken/discontinuous lines
          lineValuesWithFormat.forEach(points => {
            d3Container
              .append('path')
              .datum(points)
              .attr('class', style)
              .attr('d', area);

            d3Container
              .append('path')
              .datum(points)
              .attr('class', `line-${style}`)
              .attr('d', line);
          });
          break;

        // following styles don't care about discontinuous blocks for now and will only render the first one
        case 'line':
          d3Container
            .append('path')
            .datum(lineValuesWithFormat[0])
            .attr('class', style)
            .attr('d', line);
          break;

        case 'line-points': {
          pathContainers = d3Container
            .datum(lineValuesWithFormat[0])
            .append('g')
            .attr('id', lineData.geo_id)
            .attr(
              'class',
              d =>
                isFunction(settings.lineClassNameCallback)
                  ? settings.lineClassNameCallback(d, style)
                  : style
            );

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
              .enter();

            texts
              .append('text')
              .attr('transform', d => {
                const last = d.length - 1;
                const { value } = d[last];
                let newNumberY = y(value) + 4;
                if (newNumberY + LINE_LABEL_HEIGHT > lastNumberY) {
                  newNumberY = lastNumberY - LINE_LABEL_HEIGHT - 1;
                }
                lastNumberY = newNumberY;
                return `translate(${width + 6},${newNumberY})`;
              })

              .text(`${numLines - i}.`);

            texts
              .append('text')
              .attr('class', d => {
                if (typeof onLinkClick !== 'undefined' && d[0].nodeId && d[0].profileType) {
                  return 'link';
                }
                return '';
              })
              .attr('transform', d => {
                const last = d.length - 1;
                const { value } = d[last];
                let newNameY = y(value) + 4;
                if (newNameY + LINE_LABEL_HEIGHT > lastNameY) {
                  newNameY = lastNameY - LINE_LABEL_HEIGHT - 1;
                }
                lastNameY = newNameY;
                return `translate(${width + 20},${newNameY})`;
              })
              .on('click', d => {
                if (typeof onLinkClick !== 'undefined' && d[0].nodeId && d[0].profileType) {
                  onLinkClick(targetLink, {
                    nodeId: d[0].nodeId,
                    year
                  });
                }
              })
              .text(d => `${capitalize(i18n(d[0].name))}`);
          }

          const circles = pathContainers
            .selectAll('circle')
            .data(d => d)
            .enter();

          circles
            .append('circle')
            .attr('class', 'small-circle')
            .attr('cx', d => x(d.date))
            .attr('cy', d => y(d.value))
            .attr('r', 2);

          this.hoverCircles = circles
            .append('circle')
            .attr('class', 'hover-circle')
            .attr('cx', d => x(d.date))
            .attr('cy', d => y(d.value))
            .attr('r', 4);

          if (this.showTooltipCallback !== undefined) {
            this.hoverCircles
              .on('mousemove', d => {
                this.showTooltipCallback(
                  d,
                  d3_event.clientX + 10,
                  d3_event.clientY + window.scrollY + 10
                );
              })
              .on('mouseout', () => {
                this.hideTooltipCallback();
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
        return format(value);
      };
    } else {
      yTickFormat = (value, idx, arr) => {
        const format = d3_format('0');
        const isLast = idx === arr.length - 1;
        return `${format(value)}${isLast ? data.unit : ''}`;
      };
      xTickFormat = value => {
        const format = d3_timeFormat('%Y');
        return format(value);
      };
    }

    const xAxis = d3_axis_bottom(x)
      .ticks(ticks.xTicks || xValues.length)
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
      .attr('transform', `translate(0, ${height} )`)
      .attr('class', 'axis axis--x')
      .call(xAxis);

    d3Container
      .append('g')
      .attr('class', 'axis axis--y axis--deforestation')
      .call(yAxis);
  }

  renderLegend() {
    const { data, settings, xValues } = this.props;
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
          const style = typeof data.style !== 'undefined' ? data.style.style : lineData.style;
          const lineStyle = isFunction(settings.lineClassNameCallback)
            ? settings.lineClassNameCallback([lineData], style)
            : style;

          return (
            <li
              key={index}
              onMouseEnter={() => lineOnMouseEnter(lineData)}
              onMouseLeave={() => lineOnMouseLeave(lineData)}
            >
              <svg height="6" width="20" className="line-color">
                <g className={lineStyle}>
                  <path d="M0 3 20 3" />
                </g>
              </svg>
              <span>
                {index + 1}.{capitalize(i18n(lineData.name))}
              </span>
            </li>
          );
        })}
      </ul>
    );
  }

  render() {
    return (
      <div>
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
  data: PropTypes.object,
  onLinkClick: PropTypes.func,
  targetLink: PropTypes.string,
  settings: PropTypes.object,
  width: PropTypes.number,
  xValues: PropTypes.array,
  useBottomLegend: PropTypes.bool,
  year: PropTypes.number
};

export default Responsive()(Line);
