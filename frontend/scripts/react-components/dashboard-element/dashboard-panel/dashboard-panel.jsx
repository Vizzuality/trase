import { connect } from 'react-redux';
import React from 'react';
import PropTypes from 'prop-types';
import {
  clearDashboardPanel,
  setDashboardPanelPage,
  setDashboardPanelActiveTab,
  setDashboardPanelActiveItems,
  getDashboardPanelSearchResults,
  setDashboardPanelActiveItemsWithSearch,
  goToDashboard as goToDashboardFn
} from 'react-components/dashboard-element/dashboard-element.actions';
import DashboardPanel from 'react-components/dashboard-element/dashboard-panel/dashboard-panel.component';
import {
  getIsDisabled,
  getCompaniesTabs,
  getDynamicSentence,
  getCompaniesActiveTab,
  getCompaniesDataByTab
} from 'react-components/dashboard-element/dashboard-element.selectors';
import { getCountryNamesByCountryId } from 'reducers/app.selectors';

const mapStateToProps = (state, ownProps) => {
  const {
    loading,
    loadingItems,
    activePanelId,
    searchResults,
    companies,
    destinations,
    pages,
    data
  } = state.dashboardElement;

  return {
    pages,
    loading,
    loadingItems,
    activePanelId,
    searchResults,
    activeCompanies: companies,
    activeDestinations: destinations,
    companiesData: getCompaniesDataByTab(state),
    destinationsData: data.destinations,
    companiesTabs: getCompaniesTabs(state),
    companiesActiveTab: getCompaniesActiveTab(state),
    isDisabled: getIsDisabled(state, ownProps),
    dynamicSentenceParts: getDynamicSentence(state),
    countryNames: getCountryNamesByCountryId(state)
  };
};

const mapDispatchToProps = {
  getMoreItems: setDashboardPanelPage,
  clearActiveItems: clearDashboardPanel,
  setActiveTab: setDashboardPanelActiveTab,
  setActiveItem: setDashboardPanelActiveItems,
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
