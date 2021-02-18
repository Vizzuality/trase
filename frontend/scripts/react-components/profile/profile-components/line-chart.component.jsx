import React from 'react';
import PropTypes from 'prop-types';

import isEqual from 'lodash/isEqual';

import Line from 'react-components/profile/profile-components/line/line.component';
import UnitsTooltip from 'react-components/shared/units-tooltip/units-tooltip.component';
import formatValue from 'utils/formatValue';

class LineChart extends React.Component {
  state = { tooltipConfig: null };

  onMouseMove = (data, x, y) => {
    const { unit } = this.props;
    const text = data.name;
    const items = [
      {
        title: data.year,
        value: formatValue(data.value, unit),
        unit
      }
    ];

    const tooltipConfig = { x, y, text, items };
    this.setState(() => ({ tooltipConfig }));
  };

  onMouseLeave = () => {
    this.setState(() => ({ tooltipConfig: null }));
  };

  shouldComponentUpdate(_, nextState) {
    return !isEqual(nextState.tooltipConfig, this.state.tooltipConfig);
  }

  render() {
    const { testId, lines, xValues, unit, year, highlightYear = false } = this.props;
    const { tooltipConfig } = this.state;

    return (
      <>
        <UnitsTooltip show={!!tooltipConfig} {...tooltipConfig} />
        <Line
          testId={testId}
          lines={lines}
          xValues={xValues}
          unit={unit}
          year={year}
          highlightYear={highlightYear}
          settingsHeight={400}
          margin={{ top: 0, right: 20, bottom: 30, left: 20 }}
          showTooltipCallback={this.onMouseMove}
          hideTooltipCallback={this.onMouseLeave}
          ticks={{
            yTicks: 5,
            yTickPadding: 10,
            yTickFormatType: null,
            xTickPadding: 15
          }}
        />
      </>
    );
  }
}

LineChart.propTypes = {
  testId: PropTypes.string,
  lines: PropTypes.array,
  xValues: PropTypes.array,
  unit: PropTypes.string,
  year: PropTypes.number,
  highlightYear: PropTypes.bool
};

export default LineChart;
