import React from 'react';
import PropTypes from 'prop-types';

const percentageSuffix = (text, suffix) => `${suffix} ${text}`;
const regularSuffix = (text, suffix) => `${text} [${suffix}]`;

const AxisLabel = props => {
  const { text, suffix } = props;
  const isSuffixPercentage = suffix === '%';
  return (
    <p className="widget-yAxis-label">
      {isSuffixPercentage ? percentageSuffix(text, suffix) : regularSuffix(text, suffix)}
    </p>
  );
};

AxisLabel.propTypes = {
  text: PropTypes.string.isRequired,
  suffix: PropTypes.string.isRequired
};

export default AxisLabel;
