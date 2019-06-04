import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  getLogisticsMapLayers,
  getActiveLayers,
  getActiveParams,
  getBounds,
  getBorder
} from 'react-components/logistics-map/logistics-map.selectors';
import {
  setLogisticsMapActiveModal,
  setLayerActive as setLayerActiveFn,
  getLogisticsMapCompanies
} from 'react-components/logistics-map/logistics-map.actions';
import LogisticsMap from 'react-components/logistics-map/logistics-map.component';
import formatValue from 'utils/formatValue';
import capitalize from 'lodash/capitalize';

class LogisticsMapContainer extends React.PureComponent {
  static propTypes = {
    layers: PropTypes.array,
    tooltips: PropTypes.object,
    bounds: PropTypes.object,
    border: PropTypes.object,
    commodity: PropTypes.string,
    activeLayers: PropTypes.array,
    activeModal: PropTypes.string,
    setLayerActive: PropTypes.func.isRequired,
    getLogisticsMapCompanies: PropTypes.func.isRequired,
    setLogisticsMapActiveModal: PropTypes.func.isRequired
  };

  state = {
    mapPopUp: null
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
    }[layer.id];
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
        { title: 'Inspection level', value: data.inspection_level }
      );
      text = capitalize(layer.name);
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

  openCompaniesModal = () => this.props.setLogisticsMapActiveModal('companies');

  closeModal = () => this.props.setLogisticsMapActiveModal(null);

  render() {
    const {
      activeLayers,
      layers,
      setLayerActive,
      commodity,
      tooltips,
      activeModal,
      bounds,
      border
    } = this.props;
    const { mapPopUp } = this.state;

    return (
      <LogisticsMap
        layers={layers}
        tooltips={tooltips}
        mapPopUp={mapPopUp}
        bounds={bounds}
        border={border}
        commodity={commodity}
        activeModal={activeModal}
        activeLayers={activeLayers}
        closeModal={this.closeModal}
        buildEvents={this.buildEvents}
        setLayerActive={setLayerActive}
        openModal={this.openCompaniesModal}
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
    bounds: getBounds(state),
    border: getBorder(state),
    activeModal: state.logisticsMap.activeModal,
    tooltips: state.app.tooltips ? state.app.tooltips.logisticsMap : {}
  };
};

const mapDispatchToProps = {
  setLayerActive: setLayerActiveFn,
  getLogisticsMapCompanies,
  setLogisticsMapActiveModal
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LogisticsMapContainer);
