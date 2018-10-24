import React from 'react';
import PropTypes from 'prop-types';

const AxisLabel = props => {
  const { text, suffix } = props;
  return <p className="widget-yAxis-label">{`${text} [${suffix}]`}</p>;
};

AxisLabel.propTypes = {
  text: PropTypes.string.isRequired,
  suffix: PropTypes.string.isRequired
};

export default AxisLabel;
