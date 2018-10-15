import { connect } from 'react-redux';
import React from 'react';
import {
  clearDashboardPanel,
  getDashboardPanelData,
  setDashboardActivePanel,
  setDashboardPanelActiveId,
  getDashboardPanelSectionTabs
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
  setActivePanel: setDashboardActivePanel,
  getSectionTabs: getDashboardPanelSectionTabs
};

class DashboardPanelContainer extends React.PureComponent {

  panels = [
    { id: 'sources', title: 'sourcing places' },
    { id: 'destinations', title: 'importing countries' },
    { id: 'companies', title: 'companies' },
    { id: 'commodities', title: 'commodities' }
  ];

  render() {
    return <DashboardPanel panels={this.panels} {...this.props} />;
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DashboardPanelContainer);
