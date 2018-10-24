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
  const { text, suffix } = props;
  const isSuffixPercentage = suffix === '%';
  return (
    <p className="widget-yAxis-label">
      {isSuffixPercentage ? percentageSuffix(text, suffix) : regularSuffix(text, suffix)}
    </p>
  );
};

DashboardWidgetLabel.propTypes = {
  text: PropTypes.string.isRequired,
  suffix: PropTypes.string.isRequired
};

export default DashboardWidgetLabel;
