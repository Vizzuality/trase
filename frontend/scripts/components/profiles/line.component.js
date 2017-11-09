import _ from 'lodash';
import {
  select as d3_select,
  event as d3_event
} from 'd3-selection';
import {
  axisBottom as d3_axis_bottom,
  axisLeft as d3_axis_left
} from 'd3-axis';
import {
  scaleLinear as d3_scale_linear,
  scaleTime as d3_scale_time
} from 'd3-scale';
import { extent as d3_extent } from 'd3-array';
import {
  line as d3_line,
  area as d3_area
} from 'd3-shape';
import { format as d3_format } from 'd3-format';
import { timeFormat as d3_timeFormat } from 'd3-time-format';
import { LINE_LABEL_HEIGHT } from 'constants';
import LegendItemTemplate from 'ejs!templates/profiles/legendItem.ejs';
import abbreviateNumber from 'utils/abbreviateNumber';
import 'styles/components/profiles/line.scss';

export default class {
  constructor(className, data, xValues, settings) {
    const elem = document.querySelector(className);
    const legend = document.querySelector(`${className}-legend`);
    const margin = settings.margin;
    const width = elem.clientWidth - margin.left - margin.right;
    const height = settings.height - margin.top - margin.bottom;
    const ticks = settings.ticks;
    this.showTooltipCallback = settings.showTooltipCallback;
    this.hideTooltipCallback = settings.hideTooltipCallback;
    const allYValues = [].concat.apply([], data.lines.map(line => line.values));

    elem.innerHTML = '';
    const container = d3_select(elem)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    const x = d3_scale_time()
      .range([0, width])
      .domain(d3_extent(xValues, y => new Date(y, 0)));

    const y = d3_scale_linear()
      .rangeRound([height, 0])
      .domain(d3_extent([0, ...allYValues]));

    let lastY = height + LINE_LABEL_HEIGHT;

    const numLines = data.lines.length;

    data.lines
      .sort((a, b) => {
        const last = xValues.length - 1;
        if (a.values[last] > b.values[last]) return 1;
        if (a.values[last] < b.values[last]) return -1;
        return 0;
      })
      .filter(lineData => lineData.values.filter(v => v !== null).length)
      .forEach((lineData, i) => {
        const lineValuesWithFormat = prepareData(xValues, lineData);
        const line = d3_line()
          .x(d => x(d.date))
          .y(d => y(d.value));
        const type = typeof data.style !== 'undefined' ? data.style.type : lineData.type;
        const style = typeof data.style !== 'undefined' ? data.style.style : lineData.style;

        let area = null,
          pathContainers = null;

        switch (type) {
          case 'area':
            area = d3_area()
              .x(d => x(d.date))
              .y(height)
              .y1(d => y(d.value));

            // loop through broken/discontinuous lines
            lineValuesWithFormat.forEach(points => {
              container.append('path')
              .datum(points)
              .attr('class', style)
              .attr('d', area);

              container.append('path')
              .datum(points)
              .attr('class', `line-${style}`)
              .attr('d', line);
            });
            break;

          // following styles don't care about discontinuous blocks for now and will only render the first one
          case 'line':
            container.append('path')
              .datum(lineValuesWithFormat[0])
              .attr('class', style)
              .attr('d', line);
            break;

          case 'line-points': {
            pathContainers = container.datum(lineValuesWithFormat[0])
              .append('g')
              .attr('class', d => (_.isFunction(settings.lineClassNameCallback)) ? settings.lineClassNameCallback(d, style) : style);

            pathContainers.selectAll('path')
              .data(d => [d])
              .enter().append('path')
              .attr('d', line);


            pathContainers.selectAll('text')
              .data(d => [d])
              .enter()
              .append('text')
              .attr('transform', d => {
                const last = d.length - 1;
                const value = d[last].value;
                let newY = y(value) + 4;
                if (newY + LINE_LABEL_HEIGHT > lastY) {
                  newY = lastY - LINE_LABEL_HEIGHT;
                }
                lastY = newY;
                return `translate(${width + 6},${newY})`;
              })
              .text(d => `${numLines - i}.${_.capitalize(d[0].name)}`);

            this.circles = pathContainers.selectAll('circle')
              .data(d => d)
              .enter().append('circle')
              .attr('cx', d => x(d.date))
              .attr('cy', d => y(d.value))
              .attr('r', 4);

            if (this.showTooltipCallback !== undefined) {
              this.circles.on('mousemove', function(d) {
                this.showTooltipCallback(
                  d,
                  d3_event.clientX + 10,
                  d3_event.clientY + window.scrollY + 10
                );
              }.bind(this))
              .on('mouseout', function() {
                this.hideTooltipCallback();
              }.bind(this));
            }
            break;
          }
        }

        if (typeof lineData.legend_name !== 'undefined') {
          const legendItemHTML = LegendItemTemplate({
            name: lineData.legend_name,
            style: style
          });

          legend.innerHTML = legend.innerHTML + legendItemHTML;
        }
      });

    let yTickFormat = null,
      xTickFormat = null;
    if (ticks.yTickFormatType === 'top-location') {
      yTickFormat = (value) => abbreviateNumber(value, 3);

      xTickFormat = (value) => {
        const format = d3_timeFormat('%Y');
        return format(value);
      };
    } else {
      yTickFormat = (value) => {
        const format = d3_format('0');
        return format(value);
      };
      xTickFormat = (value) => {
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

    container.append('g')
      .attr('transform', `translate(0, ${height} )`)
      .attr('class', 'axis axis--x')
      .call(xAxis);

    container.append('g')
      .attr('class', 'axis axis--y axis--deforestation')
      .call(yAxis);
  }
}

const prepareData = (xValues, data) => {
  const continuousValues = xValues.map((year, index) => {
    return {
      name: data.name,
      date: new Date(year, 0),
      value: data.values[index],
      value9: data.value9
    };
  });

  // break down data into discontinuous blocks when data is missing, to avoid
  // having the impression values is zero while it's actually unknown
  const discontinuousValues = [[]];
  continuousValues.forEach((point, i) => {
    if (i > 0) {
      const prevPoint = continuousValues[i - 1];
      if ((prevPoint.value === null && point.value !== null) || (prevPoint.value !== null && point.value === null)) {
        discontinuousValues.push([]);
      }
    }
    discontinuousValues[discontinuousValues.length - 1].push(point);
  });

  // get rid of blocks composed of only nulls
  return discontinuousValues.filter(points => points.filter(p => p.value !== null).length);
};
