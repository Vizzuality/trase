import { connect } from 'react-redux';
import React from 'react';
import {
  clearDashboardPanel,
  getDashboardPanelData,
  setDashboardActivePanel,
  setDashboardPanelActiveId
} from 'react-components/dashboard-element/dashboard-element.actions';
import DashboardPanel from 'react-components/dashboard-element/dashboard-panel/dashboard-panel.component';
import {
  getActivePanelTabs,
  getDirtyBlocks,
  getDynamicSentence
} from 'react-components/dashboard-element/dashboard-element.selectors';

const mapStateToProps = state => {
  const {
    activePanelId,
    sourcesPanel,
    destinationsPanel,
    companiesPanel,
    commoditiesPanel,
    data: { sources, countries, commodities, companies, destinations }
  } = state.dashboardElement;

  return {
    sources,
    countries,
    companies,
    commodities,
    destinations,
    activePanelId,
    sourcesPanel,
    destinationsPanel,
    companiesPanel,
    commoditiesPanel,
    tabs: getActivePanelTabs(state),
    dirtyBlocks: getDirtyBlocks(state),
    dynamicSentenceParts: getDynamicSentence(state)
  };
};

const mapDispatchToProps = {
  getDashboardPanelData,
  clearActiveId: clearDashboardPanel,
  setActiveId: setDashboardPanelActiveId,
  setActivePanel: setDashboardActivePanel
};

class DashboardPanelContainer extends React.PureComponent {
  panels = [
    { id: 'sources', title: 'sourcing places', imageUrl: '/images/dashboards/icon_sourcing.svg' },
    { id: 'destinations', title: 'importing countries', imageUrl: '/images/dashboards/icon_importing.svg'  },
    { id: 'companies', title: 'companies', imageUrl: '/images/dashboards/icon_companies.svg'  },
    { id: 'commodities', title: 'commodities', imageUrl: '/images/dashboards/icon_commodities.svg'  }
  ];

  render() {
    return <DashboardPanel panels={this.panels} {...this.props} />;
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DashboardPanelContainer);
