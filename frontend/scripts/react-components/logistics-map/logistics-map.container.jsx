import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  getLogisticsMapLayers,
  getActiveLayers,
  getActiveParams,
  getBounds,
  getBorder,
  getHeading,
  getLogisticsMapYearsProps
} from 'react-components/logistics-map/logistics-map.selectors';
import {
  setLogisticsMapActiveModal,
  setLayerActive as setLayerActiveFn,
  getLogisticsMapCompanies,
  selectLogisticsMapYear
} from 'react-components/logistics-map/logistics-map.actions';
import LogisticsMap from 'react-components/logistics-map/logistics-map.component';
import formatValue from 'utils/formatValue';
import capitalize from 'lodash/capitalize';

const getItems = (data, commodity) => {
  switch (commodity) {
    case 'palmOil':
      return [
        { title: 'Mill ID', value: data.mill_id },
        { title: 'World Resources Institute Universal Mill List ID', value: data.uml_id || 'N/A' },
        { title: 'Mill Company Group Name', value: data.group },
        { title: 'Mill Company Name', value: data.company },
        { title: 'Mill Name', value: data.name },
        { title: 'RSPO certification status', value: data.rspo_status },
        { title: 'RSPO supply chain model type', value: data.rspo_type }
      ];

    case 'soy':
      return [
        { title: 'Company', value: data.company },
        { title: 'Municipality', value: data.municipality },
        {
          title: `Capacity (${commodity})`,
          value: formatValue(data.capacity, 'Trade volume'),
          unit: 't'
        }
      ];

    default:
      return [
        { title: 'Company', value: data.company },
        { title: 'State', value: data.state },
        { title: 'Municipality', value: data.municipality },
        { title: 'Subclass', value: data.subclass },
        { title: 'Inspection level', value: data.inspection_level }
      ];
  }
};

class LogisticsMapContainer extends React.PureComponent {
  static propTypes = {
    layers: PropTypes.array,
    tooltips: PropTypes.object,
    bounds: PropTypes.object,
    border: PropTypes.object,
    heading: PropTypes.string,
    commodity: PropTypes.string,
    selectYears: PropTypes.func,
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
      storage_facilities: 'Silo',
      mills: 'Mill'
    }[layer.id];
    if (commodity === 'cattle') {
      text = capitalize(layer.name);
    }
    const mapPopUp = {
      ...e,
      data: {
        x,
        y,
        text,
        show,
        items: getItems(data, commodity)
      }
    };
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
      heading,
      tooltips,
      activeModal,
      bounds,
      border,
      selectYears,
      logisticsMapYearProps
    } = this.props;
    const { mapPopUp } = this.state;

    return (
      <LogisticsMap
        layers={layers}
        tooltips={tooltips}
        mapPopUp={mapPopUp}
        bounds={bounds}
        border={border}
        heading={heading}
        selectYears={selectYears}
        logisticsMapYearProps={logisticsMapYearProps}
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
  const { commodity } = getActiveParams(state);
  return {
    commodity,
    activeLayers: getActiveLayers(state),
    layers: getLogisticsMapLayers(state),
    heading: getHeading(state),
    bounds: getBounds(state),
    border: getBorder(state),
    activeModal: state.logisticsMap.activeModal,
    logisticsMapYearProps: getLogisticsMapYearsProps(state),
    tooltips: state.app.tooltips ? state.app.tooltips.logisticsMap : {}
  };
};

const mapDispatchToProps = {
  getLogisticsMapCompanies,
  setLogisticsMapActiveModal,
  setLayerActive: setLayerActiveFn,
  selectYears: selectLogisticsMapYear
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LogisticsMapContainer);
