import React from 'react';
import { getLogisticsMapLayers } from 'react-components/logistics-map/logistics-map.selectors';
import LogisticsMap from 'react-components/logistics-map/logistics-map.component';
import formatValue from 'utils/formatValue';

class LogisticsMapContainer extends React.PureComponent {
  state = {
    layers: getLogisticsMapLayers(),
    mapPopUp: null
  };

  currentPopUp = null;

  onMouseOver = (e, layer) => {
    const { data } = e;
    if (!data) return;
    const show = true;
    const x = 0;
    const y = 35;
    const text = {
      crushing_facilities: 'Crushing Facility',
      brazil_refining_facilities: 'Refinery',
      storage_facilities: 'Silo'
    }[layer.name];
    const items = [
      { title: 'Company', value: data.company },
      { title: 'Municipality', value: data.municipality },
      { title: 'Production of Soy', value: formatValue(data.capacity, 'Trade volume'), unit: 't' }
    ];
    const mapPopUp = { ...e, data: { x, y, text, show, items } };
    this.setState(() => ({ mapPopUp }));
  };

  buildEvents = layer => ({
    mouseover: e => this.onMouseOver(e, layer),
    mouseout: () => this.popUp && this.popUp.remove()
  });

  getCurrentPopUp = popUp => {
    this.popUp = popUp;
  };

  render() {
    const { layers, mapPopUp } = this.state;
    return (
      <LogisticsMap
        layers={layers}
        buildEvents={this.buildEvents}
        mapPopUp={mapPopUp}
        getCurrentPopUp={this.getCurrentPopUp}
      />
    );
  }
}

export default LogisticsMapContainer;
