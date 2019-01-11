import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  getLogisticsMapLayers,
  getActiveLayers,
  getActiveParams
} from 'react-components/logistics-map/logistics-map.selectors';
import {
  setLayerActive as setLayerActiveFn,
  getLogisticsMapCompanies
} from 'react-components/logistics-map/logistics-map.actions';
import LogisticsMap from 'react-components/logistics-map/logistics-map.component';
import formatValue from 'utils/formatValue';
import startCase from 'lodash/startCase';

class LogisticsMapContainer extends React.PureComponent {
  static propTypes = {
    layers: PropTypes.array,
    tooltips: PropTypes.object,
    commodity: PropTypes.string,
    activeLayers: PropTypes.array,
    setLayerActive: PropTypes.func.isRequired,
    getLogisticsMapCompanies: PropTypes.func.isRequired
  };

  state = {
    mapPopUp: null,
    isModalOpen: false
  };

  bounds = {
    bbox: [-77.783203125, -35.46066995149529, -29.794921874999996, 9.709057068618208]
  };

  currentPopUp = null;

  componentDidMount() {
    this.props.getLogisticsMapCompanies();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.commodity !== this.props.commodity) {
      this.props.getLogisticsMapCompanies();
    }
  }

  onMouseOver = (e, layer) => {
    const { data } = e;
    const { commodity } = this.props;
    if (!data) return;
    const show = true;
    const x = 0;
    const y = 35;
    let text = {
      crushing_facilities: 'Crushing Facility',
      refining_facilities: 'Refinery',
      storage_facilities: 'Silo'
    }[layer.name];
    const items = [
      { title: 'Company', value: data.company },
      { title: 'Municipality', value: data.municipality }
    ];
    if (commodity === 'soy') {
      items.push({
        title: `Capacity (${commodity})`,
        value: formatValue(data.capacity, 'Trade volume'),
        unit: 't'
      });
    } else {
      items.splice(-1, 0, { title: 'State', value: data.state });
      items.push(
        { title: 'Subclass', value: data.subclass },
        { title: 'Inspection level', value: data.inspection }
      );
      text = startCase(layer.name);
    }
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

  openModal = () => this.setState({ isModalOpen: true });

  closeModal = () => this.setState({ isModalOpen: false });

  render() {
    const { activeLayers, layers, setLayerActive, commodity, tooltips } = this.props;
    const { mapPopUp, isModalOpen } = this.state;

    return (
      <LogisticsMap
        layers={layers}
        tooltips={tooltips}
        mapPopUp={mapPopUp}
        bounds={this.bounds}
        commodity={commodity}
        isModalOpen={isModalOpen}
        openModal={this.openModal}
        activeLayers={activeLayers}
        closeModal={this.closeModal}
        buildEvents={this.buildEvents}
        setLayerActive={setLayerActive}
        getCurrentPopUp={this.getCurrentPopUp}
      />
    );
  }
}

const mapStateToProps = state => {
  const { year: activeYear, commodity } = getActiveParams(state);
  return {
    commodity,
    activeYear,
    activeLayers: getActiveLayers(state),
    layers: getLogisticsMapLayers(state),
    tooltips: state.app.tooltips ? state.app.tooltips.logisticsMap : {}
  };
};

const mapDispatchToProps = {
  setLayerActive: setLayerActiveFn,
  getLogisticsMapCompanies
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LogisticsMapContainer);
