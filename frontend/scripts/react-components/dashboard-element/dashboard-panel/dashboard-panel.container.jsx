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
  getDashboardPanels,
  getDirtyBlocks,
  getDynamicSentence
} from 'react-components/dashboard-element/dashboard-element.selectors';

const mapStateToProps = state => {
  const {
    activePanelId,
    data: { sources, countries, commodities, companies, destinations }
  } = state.dashboardElement;

  return {
    sources,
    countries,
    companies,
    commodities,
    destinations,
    activePanelId,
    tabs: getActivePanelTabs(state),
    dirtyBlocks: getDirtyBlocks(state),
    dynamicSentenceParts: getDynamicSentence(state),
    ...getDashboardPanels(state)
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
    { id: 'sources', title: 'sourcing places' },
    { id: 'importing', title: 'importing countries' },
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
