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
    return <DashboardPanel {...this.props} companiesPanel={companiesPanel} />;
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DashboardPanelContainer);
