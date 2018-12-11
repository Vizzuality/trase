import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  getLogisticsMapLayers,
  getActiveLayers
} from 'react-components/logistics-map/logistics-map.selectors';
import { setLayerActive as setLayerActiveFn } from 'react-components/logistics-map/logistics-map.actions';
import LogisticsMap from 'react-components/logistics-map/logistics-map.component';
import formatValue from 'utils/formatValue';

class LogisticsMapContainer extends React.PureComponent {
  static propTypes = {
    layers: PropTypes.array,
    activeLayers: PropTypes.array,
    setLayerActive: PropTypes.func.isRequired
  };

  state = {
    mapPopUp: null
  };

  bounds = {
    bbox: [-77.783203125, -35.46066995149529, -29.794921874999996, 9.709057068618208]
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
    const { activeLayers, layers, setLayerActive } = this.props;
    const { mapPopUp } = this.state;
    return (
      <LogisticsMap
        layers={layers}
        mapPopUp={mapPopUp}
        bounds={this.bounds}
        activeLayers={activeLayers}
        buildEvents={this.buildEvents}
        setLayerActive={setLayerActive}
        getCurrentPopUp={this.getCurrentPopUp}
      />
    );
  }
}

const mapStateToProps = state => ({
  activeLayers: getActiveLayers(state),
  layers: getLogisticsMapLayers(state),
  activeYear: state.logisticsMap.activeYear
});

const mapDispatchToProps = {
  setLayerActive: setLayerActiveFn
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LogisticsMapContainer);
