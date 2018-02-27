import React from 'react';
import { ComposableMap, Geographies, Geography, Markers } from 'react-simple-maps';
import Arc from './map-arc.component';

class WorldMap extends React.PureComponent {
  render() {
    return (
      <ComposableMap>
        <Geographies geography="/vector_layers/WORLD.topo.json">
          {(geographies, projection) =>
            geographies.map(geography => (
              <Geography key={geography.id} geography={geography} projection={projection} />
            ))
          }
        </Geographies>
        <Markers>
          <Arc />
        </Markers>
      </ComposableMap>
    );
  }
}

WorldMap.propTypes = {};

export default WorldMap;
