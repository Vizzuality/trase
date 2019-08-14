import { connect } from 'react-redux';
import ProfileStepPanelComponent from 'react-components/shared/profile-selector/profile-panel/profile-step-panel/profile-step-panel.component';
import {
  setProfilesPage,
  setProfilesActiveItem,
  setProfilesActiveTab,
  getProfilesSearchResults,
  setProfilesActiveItemWithSearch
} from 'react-components/shared/profile-selector/profile-selector.actions';
import {
  getCompaniesActiveData,
  getCountriesActiveItems,
  getCompaniesActiveTab,
  getSourcesActiveTab,
  getCompaniesTabs,
  getSourcesTabs
} from 'react-components/shared/profile-selector/profile-selector.selectors';

const mapStateToProps = state => ({
  profileType: state.profileSelector.panels.type,
  panels: state.profileSelector.panels,
  data: state.profileSelector.data,
  companiesTabs: getCompaniesTabs(state),
  sourcesTabs: getSourcesTabs(state),
  companiesData: getCompaniesActiveData(state),
  countriesActiveItems: getCountriesActiveItems(state),
  sourcesActiveTab: getSourcesActiveTab(state),
  companiesActiveTab: getCompaniesActiveTab(state)
});

const mapDispatchToProps = {
  setProfilesPage,
  setProfilesActiveItem,
  getSearchResults: getProfilesSearchResults,
  setProfilesSearchResult: setProfilesActiveItemWithSearch,
  getMoreItems: setProfilesPage,
  setProfilesActiveTab
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProfileStepPanelComponent);
