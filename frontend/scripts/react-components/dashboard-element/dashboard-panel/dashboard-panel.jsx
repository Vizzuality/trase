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
  goToDashboard as goToDashboardFn
} from 'react-components/dashboard-element/dashboard-element.actions';
import DashboardPanel from 'react-components/dashboard-element/dashboard-panel/dashboard-panel.component';
import {
  getIsDisabled,
  getSourcesTabs,
  getCompaniesTabs,
  getDynamicSentence,
  getSourcesActiveTab,
  getCompaniesActiveTab,
  getCountriesActiveItems
} from 'react-components/dashboard-element/dashboard-element.selectors';
import { getCountryNamesByCountryId } from 'reducers/app.selectors';

const mapStateToProps = (state, ownProps) => {
  const {
    loading,
    loadingItems,
    activePanelId,
    searchResults,
    sources: sourcesPanel,
    destinations: destinationsPanel,
    companies: companiesPanel,
    commodities: commoditiesPanel,
    countries: countriesPanel,
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
    loadingItems,
    searchResults,
    countriesPanel,
    destinationsPanel,
    companiesPanel,
    commoditiesPanel,
    sourcesTabs: getSourcesTabs(state),
    companiesTabs: getCompaniesTabs(state),
    sourcesActiveTab: getSourcesActiveTab(state),
    companiesActiveTab: getCompaniesActiveTab(state),
    isDisabled: getIsDisabled(state, ownProps),
    dynamicSentenceParts: getDynamicSentence(state),
    countryNames: getCountryNamesByCountryId(state),
    countriesActiveItems: getCountriesActiveItems(state)
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
  goToDashboard: goToDashboardFn
};

class DashboardPanelContainer extends React.PureComponent {
  static propTypes = {
    searchResults: PropTypes.array,
    countryNames: PropTypes.object
  };

  static addCountryNameToSearchResults(searchResults, countryNames) {
    return searchResults.map(item => ({
      ...item,
      countryName: countryNames[item.countryId]
    }));
  }

  render() {
    const searchResults = DashboardPanelContainer.addCountryNameToSearchResults(
      this.props.searchResults,
      this.props.countryNames
    );
    return <DashboardPanel {...this.props} searchResults={searchResults} />;
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DashboardPanelContainer);
