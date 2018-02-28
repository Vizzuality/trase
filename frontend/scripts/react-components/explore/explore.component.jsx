import React from 'react';
import PropTypes from 'prop-types';
import WorldMap from 'react-components/shared/world-map/world-map.component';

const origin = {
  coordinates: [-99.133209, 19.432608],
  iso: 'MX'
};

function Explore(props) {
  const { flows } = props;
  return (
    <div className="l-explore">
      <div className="c-explore">
        <WorldMap flows={flows} origin={origin} />
      </div>
    </div>
  );
}

Explore.propTypes = {
  flows: PropTypes.array
};

export default Explore;
