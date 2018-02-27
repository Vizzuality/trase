import React from 'react';
import { ComposableMap, Geographies, Geography, Markers, Marker, ZoomableGroup } from 'react-simple-maps';
import Arc from './map-arc.component';

const markers = [
  { markerOffset: -35, name: "Buenos Aires", coordinates: [-58.3816, -34.6037] },
  { markerOffset: -35, name: "La Paz", coordinates: [-68.1193, -16.4897] },
  { markerOffset: 15, name: "Brasilia", coordinates: [-47.8825, -15.7942] },
  { markerOffset: 15, name: "Santiago", coordinates: [-70.6693, -33.4489] },
  { markerOffset: 15, name: "Bogota", coordinates: [-74.0721, 4.7110] },
  { markerOffset: 15, name: "Quito", coordinates: [-78.4678, -0.1807] },
  { markerOffset: -35, name: "Georgetown", coordinates: [-58.1551, 6.8013] },
  { markerOffset: -35, name: "Asuncion", coordinates: [-57.5759, -25.2637] },
  { markerOffset: 15, name: "Paramaribo", coordinates: [-55.2038, 5.8520] },
  { markerOffset: 15, name: "Montevideo", coordinates: [-56.1645, -34.9011] },
  { markerOffset: -35, name: "Caracas", coordinates: [-66.9036, 10.4806] }
];

class WorldMap extends React.PureComponent {
  render() {
    return (
      <ComposableMap>
        <ZoomableGroup>
          <Geographies geography="/vector_layers/WORLD.topo.json">
            {(geographies, projection) =>
              geographies.map(geography => (
                <Geography key={geography.id} geography={geography} projection={projection}/>
              ))
            }
          </Geographies>
          <Markers>
            {markers.map(marker => (
              <Arc arc={{ coordinates: {
                  start: marker.coordinates,
                  end: [-99.14337158203125, 19.435514339097825]
                }}}/>
            ))}
          </Markers>
        </ZoomableGroup>
      </ComposableMap>
    );
  }
}

WorldMap.propTypes = {};

export default WorldMap;
