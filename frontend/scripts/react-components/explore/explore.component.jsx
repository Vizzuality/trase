import React from 'react';
import PropTypes from 'prop-types';
import WorldMap from 'react-components/shared/world-map/world-map.component';

function Explore(props) {
  const { flows, origin } = props;
  return (
    <div className="l-explore">
      <div className="c-explore">
        <WorldMap flows={flows} origin={origin} />
      </div>
    </div>
  );
}

Explore.propTypes = {
  flows: PropTypes.array,
  origin: PropTypes.object
};

export default Explore;
