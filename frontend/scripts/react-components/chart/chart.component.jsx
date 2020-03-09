import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  Line,
  Bar,
  Cell,
  Area,
  Pie,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  PieChart
} from 'recharts';

import CustomXAxis from 'react-components/chart/x-axis.component';
import CustomYAxis from 'react-components/chart/y-axis.component';
import 'react-components/chart/chart-styles.scss';

class Chart extends PureComponent {
  static propTypes = {
    data: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
    meta: PropTypes.object,
    config: PropTypes.object,
    className: PropTypes.string,
    variant: PropTypes.string,
    handleMouseMove: PropTypes.func,
    handleMouseLeave: PropTypes.func,
    testId: PropTypes.string,
    containerRef: PropTypes.node
  };

  static defaultProps = {
    className: '',
    variant: 'dark',
    handleMouseMove: null,
    handleMouseLeave: null
  };

  render() {
    const {
      className,
      data,
      meta,
      config,
      handleMouseMove,
      handleMouseLeave,
      testId,
      variant,
      containerRef
    } = this.props;
    const {
      margin = {},
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

    let ChartComponent;
    switch (type) {
      case 'pie':
        ChartComponent = PieChart;
        break;

      default: {
        ChartComponent = ComposedChart;
      }
    }
    let horizontalChartProps = {};
    if (layout === 'vertical') {
      horizontalChartProps = {
        layout,
        barCategoryGap: '10'
      };
    }
    const defaultMargin = { top: 20, right: 0, left: 100, bottom: 20 };
    return (
      <div className={`c-chart ${className}`} style={{ height }} data-test={testId}>
        <ResponsiveContainer>
          <ChartComponent
            height={height}
            data={data}
            margin={{ ...defaultMargin, ...margin }}
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

            {cartesianGrid && <CartesianGrid stroke="#536269" {...cartesianGrid} />}
            {CustomXAxis({ config, data, meta, variant })}
            {CustomYAxis({ config, data, meta, variant })}
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
                containerRef={containerRef}
                {...tooltip}
              />
            )}

            {legend && <Legend {...legend} />}
          </ChartComponent>
        </ResponsiveContainer>
      </div>
    );
  }
}

export default Chart;
