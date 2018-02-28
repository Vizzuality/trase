import React from 'react';
import { ComposableMap, Geographies, Geography, Markers, ZoomableGroup } from 'react-simple-maps';
import Arc from './map-arc.component';

const markers = [
  {
    markerOffset: -35,
    name: 'Buenos Aires',
    coordinates: [-58.3816, -34.6037],
    curveStyle: 'concave',
    strokeWidth: 10
  },
  {
    markerOffset: -35,
    name: 'La Paz',
    coordinates: [-68.1193, -16.4897],
    curveStyle: 'concave',
    strokeWidth: 9
  },
  {
    markerOffset: 15,
    name: 'Brasilia',
    coordinates: [-47.8825, -15.7942],
    curveStyle: 'concave',
    strokeWidth: 8
  },
  { markerOffset: 15, name: 'Santiago', coordinates: [-70.6693, -33.4489], curveStyle: 'concave' },
  {
    markerOffset: 15,
    name: 'Bogota',
    coordinates: [-74.0721, 4.711],
    curveStyle: 'convex',
    strokeWidth: 7
  },
  {
    markerOffset: 15,
    name: 'Quito',
    coordinates: [-78.4678, -0.1807],
    curveStyle: 'concave',
    strokeWidth: 6
  },
  {
    markerOffset: -35,
    name: 'Georgetown',
    coordinates: [-58.1551, 6.8013],
    curveStyle: 'convex',
    strokeWidth: 5
  },
  {
    markerOffset: -35,
    name: 'Asuncion',
    coordinates: [-57.5759, -25.2637],
    curveStyle: 'concave',
    strokeWidth: 4
  },
  {
    markerOffset: 15,
    name: 'Paramaribo',
    coordinates: [-55.2038, 5.852],
    curveStyle: 'convex',
    strokeWidth: 3
  },
  {
    markerOffset: 15,
    name: 'Montevideo',
    coordinates: [-56.1645, -34.9011],
    curveStyle: 'concave',
    strokeWidth: 2
  },
  {
    markerOffset: -35,
    name: 'Caracas',
    coordinates: [-66.9036, 10.4806],
    curveStyle: 'convex',
    strokeWidth: 1
  }
];

class WorldMap extends React.PureComponent {
  static buildCurves(start, end, arc) {
    const x0 = start[0];
    const x1 = end[0];
    const y0 = start[1];
    const y1 = end[1];
    const curve = {
      concave: `${x1} ${y0}`,
      convex: `${x0} ${y1}`
    }[arc.curveStyle];

    return `M ${start.join(' ')} Q ${curve} ${end.join(' ')}`;
  }

  render() {
    return (
      <ComposableMap>
        <ZoomableGroup>
          <Geographies geography="/vector_layers/WORLD.topo.json">
            {(geographies, projection) =>
              geographies.map(geography => (
                <Geography key={geography.id} geography={geography} projection={projection} />
              ))
            }
          </Geographies>
          <Markers>
            {markers.map(marker => (
              <Arc
                arc={{
                  coordinates: {
                    start: marker.coordinates,
                    end: [151.2400245666504, -33.93638164139202]
                  },
                  curveStyle: marker.curveStyle
                }}
                buildPath={WorldMap.buildCurves}
                strokeWidth={marker.strokeWidth}
              />
            ))}
          </Markers>
        </ZoomableGroup>
      </ComposableMap>
    );
  }
}

WorldMap.propTypes = {};

export default WorldMap;
