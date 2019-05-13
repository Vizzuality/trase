import React from 'react';
import { YAxis } from 'recharts';
import PropTypes from 'prop-types';

import findMaxValue from 'utils/findChartMaxValue';
import ChartTick from 'react-components/chart/tick/tick.component';
import CategoryTick from 'react-components/chart/tick/category-tick.component';
import 'react-components/chart/chart-styles.scss';

function CustomYAxis({ config, data, id }) {
  const { yAxis, unit, unitFormat, yKeys, yKey, yLabelsProfileInfo } = config;
  const nodeIds = yLabelsProfileInfo
    ? data.map((d, i) => ({ ...d, ...yLabelsProfileInfo[i] }))
    : null;
  // horizontal charts
  if (yKey) {
    return (
      <YAxis
        axisLine={false}
        tickLine={false}
        tickMargin={15}
        dataKey={yKey || ''}
        {...yAxis}
        tick={<CategoryTick config={config} nodeIds={nodeIds} id={id} />}
      />
    );
  }
  const maxYValue = findMaxValue(data, yKeys);
  return (
    yAxis && (
      <YAxis
        axisLine={false}
        tickSize={-100}
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

CustomYAxis.propTypes = {
  config: PropTypes.object.isRequired,
  data: PropTypes.array
};

export default CustomYAxis;
