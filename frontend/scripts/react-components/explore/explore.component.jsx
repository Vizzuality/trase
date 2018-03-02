import React from 'react';
import WorldMap from 'react-components/shared/world-map/world-map.container';

function Explore() {
  return (
    <div className="l-explore">
      <div className="c-explore">
        <div className="row column">
          <div className="explore-map-container">
            <WorldMap className="explore-world-map" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Explore;
