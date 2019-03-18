import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import maxBy from 'lodash/maxBy';
import max from 'lodash/max';

import {
  Line,
  Bar,
  Cell,
  Area,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  PieChart,
  Label
} from 'recharts';

import ChartTick from 'react-components/chart/tick/tick.component';
import CategoryTick from 'react-components/chart/tick/category-tick.component';

import 'react-components/chart/chart-styles.scss';

class Chart extends PureComponent {
  static propTypes = {
    data: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
    config: PropTypes.shape({}).isRequired,
    className: PropTypes.string,
    handleMouseMove: PropTypes.func,
    handleMouseLeave: PropTypes.func
  };

  static defaultProps = {
    className: '',
    handleMouseMove: null,
    handleMouseLeave: null
  };

  findMaxValue = (data, axisKeys) => {
    const maxValues = [];
    Object.keys(axisKeys).forEach(key => {
      Object.keys(axisKeys[key]).forEach(subKey => {
        maxValues.push(maxBy(data, subKey)[subKey]);
      });
    });
    return max(maxValues);
  };

  renderXAxis() {
    const { config, data } = this.props;
    const { xKey, xKeys, xAxis, layout, unit } = config;
    if (!xAxis) return null;
    if (layout === 'vertical') {
      const maxXValue = this.findMaxValue(data, xKeys);
      return (
        <XAxis
          axisLine={false}
          tickLine={false}
          tickMargin={10}
          tick={
            <ChartTick
              dataMax={maxXValue}
              unitFormat={value => value}
              unit={unit}
              backgroundColor="transparent"
              fill="white"
            />
          }
          {...xAxis}
        >
          <Label position="insideBottom" offset={-15} className="x-axis-label">
            {unit}
          </Label>
        </XAxis>
      );
    }

    return <XAxis dataKey={xKey || ''} tick={{ fontSize: 12 }} {...xAxis} />;
  }

  renderYAxis() {
    const { config, data } = this.props;
    const { yAxis, unit, unitFormat, yKeys, yKey } = config;
    if (yKey)
      return (
        <YAxis
          axisLine={false}
          tickLine={false}
          tickMargin={15}
          dataKey={yKey || ''}
          tick={<CategoryTick />}
          {...yAxis}
        />
      );
    const maxYValue = this.findMaxValue(data, yKeys);
    return (
      yAxis && (
        <YAxis
          axisLine={false}
          tickSize={-50}
          mirror
          tickMargin={0}
          tickLine={false}
          tick={
            <ChartTick
              dataMax={maxYValue}
              unit={unit || ''}
              unitFormat={unitFormat || (value => value)}
              fill="#555555"
            />
          }
          {...yAxis}
        />
      )
    );
  }

  render() {
    const { className, data, config, handleMouseMove, handleMouseLeave } = this.props;

    const {
      margin = { top: 20, right: 0, left: 50, bottom: 20 },
      padding = { top: 0, right: 0, left: 0, bottom: 0 },
      type,
      yKeys,
      xKeys,
      cartesianGrid,
      gradients,
      height,
      patterns,
      tooltip,
      legend,
      colors,
      layout
    } = config;
    const axisKeys = xKeys || yKeys;
    const { lines, bars, areas, pies } = axisKeys;

    let CHART;
    switch (type) {
      case 'pie':
        CHART = PieChart;
        break;

      default: {
        CHART = ComposedChart;
      }
    }
    let horizontalChartProps = {};
    let chartMargin = margin;
    if (layout === 'vertical') {
      horizontalChartProps = {
        layout,
        barCategoryGap: '10'
      };
      chartMargin = { ...margin, left: margin.left + 70 };
    }
    return (
      <div className={`c-chart ${className}`} style={{ height }}>
        <ResponsiveContainer>
          <CHART
            height={height}
            data={data}
            margin={chartMargin}
            padding={padding}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            {...horizontalChartProps}
          >
            <defs>
              {gradients &&
                Object.keys(gradients).map(key => (
                  <linearGradient key={`lg_${key}`} {...gradients[key].attributes}>
                    {gradients[key].stops &&
                      Object.keys(gradients[key].stops).map(sKey => (
                        <stop key={`st_${sKey}`} {...gradients[key].stops[sKey]} />
                      ))}
                  </linearGradient>
                ))}

              {patterns &&
                Object.keys(patterns).map(key => (
                  <pattern key={`pattern_${key}`} {...patterns[key].attributes}>
                    {patterns[key].children &&
                      Object.keys(patterns[key].children).map(iKey => {
                        const { tag } = patterns[key].children[iKey];

                        return React.createElement(tag, {
                          key: iKey,
                          ...patterns[key].children[iKey]
                        });
                      })}
                  </pattern>
                ))}
            </defs>

            {cartesianGrid && (
              <CartesianGrid strokeDasharray="4 4" stroke="#d6d6d9" {...cartesianGrid} />
            )}
            {this.renderXAxis()}
            {this.renderYAxis()}
            {areas &&
              Object.keys(areas).map(key => (
                <Area key={key} dataKey={key} dot={false} {...areas[key]} />
              ))}

            {lines &&
              Object.keys(lines).map(key => (
                <Line key={key} dataKey={key} dot={false} strokeWidth={2} {...lines[key]} />
              ))}

            {bars &&
              Object.keys(bars).map(key => (
                <Bar key={key} dataKey={key} dot={false} {...bars[key]}>
                  {bars[key].itemColor &&
                    data.map(item => {
                      const { color } = colors.find(c => c.key === key) || {};
                      return <Cell key={`c_${item.color || color}`} fill={item.color || color} />;
                    })}
                </Bar>
              ))}

            {pies &&
              Object.keys(pies).map(key => (
                <Pie key={key} data={data} dataKey={key} {...pies[key]}>
                  {data.map((item, index) => {
                    const { color } = colors[index] || {};
                    return (
                      <Cell
                        key={`c_${item.color || color}`}
                        fill={item.color || color}
                        stroke={item.color || color}
                      />
                    );
                  })}
                </Pie>
              ))}

            {tooltip && (
              <Tooltip
                cursor={{
                  opacity: 0.5,
                  stroke: '#d6d6d9',
                  ...(!!bars && { strokeWidth: `${1.1 * (100 / data.length)}%` })
                }}
                isAnimationActive={false}
                {...tooltip}
              />
            )}

            {legend && <Legend {...legend} />}
          </CHART>
        </ResponsiveContainer>
      </div>
    );
  }
}

export default Chart;
