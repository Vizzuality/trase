import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
  clearDashaboardPanel,
  getDashboardPanelData,
  setDashboardPanelActiveId
} from 'react-components/dashboard-element/dashboard-element.actions';
import DashboardPanel from 'react-components/dashboard-element/dashboard-panel/dashboard-panel.component';
import {
  getDashboardPanels,
  getDirtyBlocks
} from 'react-components/dashboard-element/dashboard-panel/dashboard-panel.selectors';
import PropTypes from 'prop-types';

const mapStateToProps = state => {
  const {
    data: { jurisdictions, countries, commodities, companies }
  } = state.dashboardElement;
  return {
    countries,
    companies,
    commodities,
    jurisdictions,
    dirtyBlocks: getDirtyBlocks(state),
    ...getDashboardPanels(state)
  };
};

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getData: getDashboardPanelData,
      setActiveId: setDashboardPanelActiveId,
      clearActiveId: clearDashaboardPanel
    },
    dispatch
  );

class DashboardPanelContainer extends React.PureComponent {
  static propTypes = {
    dirtyBlocks: PropTypes.object,
    getData: PropTypes.func.isRequired
  };

  state = {
    activePanelId: null
  };

  panels = [
    { id: 'sourcing', title: 'sourcing places' },
    { id: 'importing', title: 'importing countries' },
    { id: 'companies', title: 'companies' },
    { id: 'commodities', title: 'commodities' }
  ];

  tabs = {
    jurisdictions: ['biome', 'state', 'municipality'],
    companies: ['importers', 'exporters']
  };

  componentDidUpdate(prevProps, prevState) {
    const { activePanelId } = this.state;
    if (prevState.activePanelId !== activePanelId) {
      this.props.getData(activePanelId);
    }
  }

  setActivePanel = activePanelId => {
    this.setState({ activePanelId });
  };

  render() {
    const { activePanelId } = this.state;
    return (
      <DashboardPanel
        tabs={this.tabs}
        panels={this.panels}
        setActivePanel={this.setActivePanel}
        activePanelId={activePanelId}
        {...this.props}
      />
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DashboardPanelContainer);
