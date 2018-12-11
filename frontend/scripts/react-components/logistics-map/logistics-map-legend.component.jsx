import React from 'react';
import PropTypes from 'prop-types';

import 'styles/components/logistics-map/logistics-map-legend.scss';

function LogisticsMapLegend(props) {
  return <div className="c-logistics-map-legend">{props.name}</div>;
}

LogisticsMapLegend.propTypes = {
  name: PropTypes.string
};

export default LogisticsMapLegend;
