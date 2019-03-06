import { connect } from 'react-redux';
import React from 'react';
import PropTypes from 'prop-types';
import {
  clearDashboardPanel,
  setDashboardPanelPage,
  setDashboardPanelActiveTab,
  setDashboardPanelActiveItem,
  setDashboardPanelActiveItems,
  getDashboardPanelSearchResults,
  setDashboardPanelActiveItemsWithSearch,
  setDashboardActivePanel
} from 'react-components/dashboard-element/dashboard-element.actions';
import DashboardPanel from 'react-components/dashboard-element/dashboard-panel/dashboard-panel.component';
import {
  getActivePanelTabs,
  getDirtyBlocks,
  getDynamicSentence
} from 'react-components/dashboard-element/dashboard-element.selectors';
import { getCountryNamesByCountryId } from 'reducers/app.selectors';

const mapStateToProps = state => {
  const {
    loading,
    activePanelId,
    sourcesPanel,
    destinationsPanel,
    companiesPanel,
    commoditiesPanel,
    countriesPanel,
    data: { sources, countries, commodities, companies, destinations }
  } = state.dashboardElement;

  return {
    loading,
    sources,
    countries,
    companies,
    commodities,
    destinations,
    activePanelId,
    sourcesPanel,
    countriesPanel,
    destinationsPanel,
    companiesPanel,
    commoditiesPanel,
    countryNames: getCountryNamesByCountryId(state),
    tabs: getActivePanelTabs(state),
    dirtyBlocks: getDirtyBlocks(state),
    dynamicSentenceParts: getDynamicSentence(state)
  };
};

const mapDispatchToProps = {
  getMoreItems: setDashboardPanelPage,
  clearActiveItems: clearDashboardPanel,
  setActiveTab: setDashboardPanelActiveTab,
  setActiveItems: setDashboardPanelActiveItems,
  setActiveItem: setDashboardPanelActiveItem,
  getSearchResults: getDashboardPanelSearchResults,
  setSearchResult: setDashboardPanelActiveItemsWithSearch,
  setActivePanel: setDashboardActivePanel
};

class DashboardPanelContainer extends React.PureComponent {
  panels = [
    {
      id: 'sources',
      title: 'Regions of production',
      imageUrl: '/images/dashboards/icon_sourcing.svg',
      whiteImageUrl: '/images/dashboards/icon_sourcing_white.svg'
    },
    {
      id: 'destinations',
      title: 'importing countries',
      imageUrl: '/images/dashboards/icon_importing.svg',
      whiteImageUrl: '/images/dashboards/icon_importing_white.svg'
    },
    {
      id: 'companies',
      title: 'companies',
      imageUrl: '/images/dashboards/icon_companies.svg',
      whiteImageUrl: '/images/dashboards/icon_companies_white.svg'
    },
    {
      id: 'commodities',
      title: 'commodities',
      imageUrl: '/images/dashboards/icon_commodities.svg',
      whiteImageUrl: '/images/dashboards/icon_commodities_white.svg'
    }
  ];

  static propTypes = {
    companiesPanel: PropTypes.object,
    countryNames: PropTypes.object
  };

  static addCountryNameToSearchResults(panel, countryNames) {
    const searchResults = panel.searchResults.map(item => ({
      ...item,
      countryName: countryNames[item.countryId]
    }));

    return { ...panel, searchResults };
  }

  render() {
    const companiesPanel = DashboardPanelContainer.addCountryNameToSearchResults(
      this.props.companiesPanel,
      this.props.countryNames
    );
    return <DashboardPanel {...this.props} panels={this.panels} companiesPanel={companiesPanel} />;
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DashboardPanelContainer);
