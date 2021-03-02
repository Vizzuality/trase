import React from 'react';
import PropTypes from 'prop-types';

const percentageSuffix = (text, suffix) => `${suffix} ${text}`;
const regularSuffix = (text, suffix) => (
  <React.Fragment>
    {text}
    {suffix && <span className="widget-yAxis-label-unit">[{suffix}]</span>}
  </React.Fragment>
);

const DashboardWidgetLabel = props => {
  const { text, suffix, axis } = props;
  const isSuffixPercentage = suffix === '%';
  const yAxisContent = isSuffixPercentage ? percentageSuffix(text, suffix) : regularSuffix(text, suffix);
  return (
    <p className={`widget-${axis}Axis-label`}>
      {axis === 'y' ? yAxisContent : text}
    </p>
  );
};

DashboardWidgetLabel.propTypes = {
  text: PropTypes.string.isRequired,
  suffix: PropTypes.string.isRequired,
  axis: PropTypes.string
};

DashboardWidgetLabel.defaultProps = {
  axis: 'y'
};

export default DashboardWidgetLabel;
