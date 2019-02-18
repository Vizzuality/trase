import { connect } from 'react-redux';
import React from 'react';
import PropTypes from 'prop-types';
import {
  clearDashboardPanel,
  setDashboardPanelPage,
  setDashboardActivePanel,
  setDashboardPanelActiveTab,
  setDashboardPanelActiveItem,
  getDashboardPanelSearchResults,
  setDashboardPanelActiveItemWithSearch
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
  clearActiveItem: clearDashboardPanel,
  setActivePanel: setDashboardActivePanel,
  setActiveTab: setDashboardPanelActiveTab,
  setActiveItem: setDashboardPanelActiveItem,
  getSearchResults: getDashboardPanelSearchResults,
  setSearchResult: setDashboardPanelActiveItemWithSearch
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

DashboardPanelContainer.propTypes = {
  companiesPanel: PropTypes.array,
  countryNames: PropTypes.array
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DashboardPanelContainer);
