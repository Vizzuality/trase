import React from 'react';
import { Label, XAxis } from 'recharts';
import PropTypes from 'prop-types';
import findMaxValue from 'utils/findChartMaxValue';
import ChartTick from 'react-components/chart/tick/tick.component';
import { format } from 'd3-format';
import 'react-components/chart/chart-styles.scss';

function CustomXAxis(props) {
  const { config, data, variant } = props;
  const { xKey, xKeys, xAxis, layout, unit, unitFormat } = config;
  const fillColor = {
    dark: '#ffffff',
    light: '#34444c'
  }[variant];
  if (!xAxis) return null;
  // horizontal charts
  if (layout === 'vertical') {
    const maxXValue = findMaxValue(data, xKeys);
    return (
      <XAxis
        axisLine={false}
        tickLine={false}
        tickMargin={10}
        {...xAxis}
        tick={
          <ChartTick
            dataMax={maxXValue}
            unitFormat={unitFormat || (value => format('.2s')(value))}
            unit={unit}
            backgroundColor="transparent"
            fill={fillColor}
          />
        }
      >
        <Label position="insideBottom" offset={-15} className="x-axis-label">
          {unit}
        </Label>
      </XAxis>
    );
  }

  return <XAxis dataKey={xKey || ''} tick={{ fontSize: 12 }} {...xAxis} />;
}

CustomXAxis.propTypes = {
  variant: PropTypes.string.isRequired,
  config: PropTypes.object.isRequired,
  data: PropTypes.array
};

export default CustomXAxis;
