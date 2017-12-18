import {
  select as d3_select,
  event as d3_event
} from 'd3-selection';
import {
  axisBottom as d3_axis_bottom,
  axisLeft as d3_axis_left
} from 'd3-axis';
import { scaleLinear as d3_scale_linear } from 'd3-scale';
import { extent as d3_extent } from 'd3-array';
import 'd3-transition';

import ScatterplotSwitcherTemplate from 'templates/profiles/scatterplot/scatterplot-switcher.ejs';
import 'styles/components/profiles/scatterplot.scss';
import abbreviateNumber from 'utils/abbreviateNumber';

export default class {
  constructor(className, settings) {
    this.el = document.querySelector(className);
    this.switcherEl = document.querySelector('.js-scatterplot-switcher');
    this.titleEl = document.querySelector('.js-scatterplot-title');
    this.data = settings.data;
    this.xDimension = settings.xDimension;
    this.node = settings.node;
    this.verbGerund = settings.verbGerund;
    this.year = settings.year;
    this.showTooltipCallback = settings.showTooltipCallback;
    this.hideTooltipCallback = settings.hideTooltipCallback;

    this._render();
    this._renderXswitcher();
  }

  _render() {
    this.titleEl.textContent = `Comparing companies ${this.verbGerund} Soy from Brazil in ${this.year}`;
    const margin = { top: 20, right: 13, bottom: 30, left: 29 };
    this.width = this.el.clientWidth - margin.left - margin.right;
    this.height = 377 - margin.top - margin.bottom;
    const allYValues = this.data.map(item => item.y);
    const allXValues = this.data.map(item => item.x[0]);

    this.x = d3_scale_linear()
      .range([0, this.width])
      .domain(d3_extent([0, ...allXValues]));

    this.y = d3_scale_linear()
      .range([this.height, 0])
      .domain(d3_extent([0, ...allYValues]));

    this.xAxis = d3_axis_bottom(this.x)
      .ticks(8)
      .tickSize(-this.height, 0)
      .tickPadding(9)
      .tickFormat((value, i) => {
        if (i === 0) {
          return null;
        }

        return abbreviateNumber(value, 3);
      });

    this.yAxis = d3_axis_left(this.y)
      .ticks(7)
      .tickSize(-this.width, 0)
      .tickPadding(9)
      .tickFormat((value) => {
        return abbreviateNumber(value, 3);
      });

    this.svg = d3_select(this.el)
      .append('svg')
      .attr('width', this.width + margin.left + margin.right)
      .attr('height', this.height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    this.svg.append('g')
      .attr('class', 'axis axis--x')
      .attr('transform', 'translate(0,' + this.height + ')')
      .call(this.xAxis);

    this.svg.append('g')
      .attr('class', 'axis axis-line')
      .attr('transform', 'translate(0,' + this.height + ')')
      .call(d3_axis_bottom(this.x).ticks(0).tickSizeOuter(0));

    this.svg.append('g')
      .attr('class', 'axis axis--y')
      .call(this.yAxis);

    this.svg.append('g')
      .attr('class', 'axis axis-line')
      .call(d3_axis_left(this.y).ticks(0).tickSizeOuter(0));

    this.circles = this.svg.selectAll('circle')
      .data(this._getFormatedData(0))
      .enter()
      .append('circle')
      .attr('class', d => this._getCircleClass(d))
      .attr('r', 5)
      .attr('cx', d => this.x(d.x))
      .attr('cy', d => this.y(d.y));

    if (this.showTooltipCallback !== undefined) {
      this.circles.on('mousemove', function(d) {
        const selectedSwitcher = document.querySelector('.js-scatterplot-switcher-item.selected span');

        this.showTooltipCallback(
          d,
          {
            name: selectedSwitcher.innerHTML,
            unit: selectedSwitcher.getAttribute('data-unit'),
          },
          d3_event.clientX + 10,
          d3_event.clientY + window.scrollY + 10
        );
      }.bind(this))
      .on('mouseout', function() {
        this.hideTooltipCallback();
      }.bind(this));
    }
  }

  _renderXswitcher() {
    // temporal fix to 3 last tabs being empty
    const tabs = this.xDimension.filter((x, i) => i < 3);
    this.switcherEl.innerHTML = ScatterplotSwitcherTemplate({ data: tabs });

    this.switchers = Array.prototype.slice.call(this.switcherEl.querySelectorAll('.js-scatterplot-switcher-item'), 0);
    this.switchers.forEach(switcher => {
      switcher.addEventListener('click', (e) => this._switchTab(e));
    });
  }

  _switchTab(e) {
    const selectedSwitch = e && e.currentTarget;
    if (!selectedSwitch) {
      return;
    }

    const selectedTabKey = selectedSwitch.getAttribute('data-key');
    this.switchers.forEach(switcher => {
      switcher.classList.remove('selected');
    });
    selectedSwitch.classList.add('selected');

    const newData = this._getFormatedData(selectedTabKey);
    const allXValues = newData.map(item => item.x);
    const x = d3_scale_linear()
      .range([0, this.width])
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

  _getFormatedData(i) {
    return this.data.map(item => {
      return {
        nodeId: item.id,
        name: item.name,
        y: item.y,
        x: item.x[i]
      };
    });
  }

  _getCircleClass(d) {
    return d.name.toUpperCase() === this.node.name.toUpperCase() ? 'dot current' : 'dot';
  }
}
