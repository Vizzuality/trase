import React from 'react';
import WorldMap from 'react-components/shared/world-map/world-map.component';

const flows = [
  {
    markerOffset: -35,
    name: 'Argentina',
    iso: 'AR',
    coordinates: [-58.3816, -34.6037],
    curveStyle: 'concave',
    strokeWidth: 10
  },
  {
    markerOffset: -35,
    name: 'Bolivia',
    iso: 'BO',
    coordinates: [-68.1193, -16.4897],
    curveStyle: 'concave',
    strokeWidth: 9
  },
  {
    markerOffset: 15,
    name: 'Brazil',
    iso: 'BR',
    coordinates: [-47.8825, -15.7942],
    curveStyle: 'concave',
    strokeWidth: 8
  },
  { markerOffset: 15, name: 'Santiago', coordinates: [-70.6693, -33.4489], curveStyle: 'concave' },
  {
    markerOffset: 15,
    name: 'Colombia',
    iso: 'CO',
    coordinates: [-74.0721, 4.711],
    curveStyle: 'convex',
    strokeWidth: 7
  },
  {
    markerOffset: 15,
    name: 'Ecuador',
    iso: 'EC',
    coordinates: [-78.4678, -0.1807],
    curveStyle: 'concave',
    strokeWidth: 6
  },
  {
    markerOffset: -35,
    name: 'Guyana',
    iso: 'GY',
    coordinates: [-58.1551, 6.8013],
    curveStyle: 'convex',
    strokeWidth: 5
  },
  {
    markerOffset: -35,
    name: 'Paraguay',
    iso: 'PY',
    coordinates: [-57.5759, -25.2637],
    curveStyle: 'concave',
    strokeWidth: 4
  },
  {
    markerOffset: 15,
    name: 'Suriname',
    iso: 'SR',
    coordinates: [-55.2038, 5.852],
    curveStyle: 'convex',
    strokeWidth: 3
  },
  {
    markerOffset: 15,
    name: 'Uruguay',
    iso: 'UR',
    coordinates: [-56.1645, -34.9011],
    curveStyle: 'concave',
    strokeWidth: 2
  },
  {
    markerOffset: -35,
    name: 'Venezuela',
    iso: 'VE',
    coordinates: [-66.9036, 10.4806],
    curveStyle: 'convex',
    strokeWidth: 1
  }
];

const origin = {
  coordinates: [-99.133209, 19.432608],
  iso: 'MX'
};

function Explore() {
  return (
    <div className="l-explore">
      <div className="c-explore">
        <WorldMap flows={flows} origin={origin} />
      </div>
    </div>
  );
}

export default Explore;
