import { connect } from 'react-redux';
import ProfileStepPanelComponent from 'react-components/shared/profile-selector/profile-panel/profile-step-panel/profile-step-panel.component';
import { profileSelectorActions } from 'react-components/shared/profile-selector/profile-selector.register';
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
  setProfilesPage: profileSelectorActions.setProfilesPage,
  setProfilesActiveItem: profileSelectorActions.setProfilesActiveItem,
  getSearchResults: profileSelectorActions.getProfilesSearchResults,
  setProfilesSearchResult: profileSelectorActions.setProfilesActiveItemWithSearch,
  getMoreItems: profileSelectorActions.setProfilesPage,
  setProfilesActiveTab: profileSelectorActions.setProfilesActiveTab
};

export default connect(mapStateToProps, mapDispatchToProps)(ProfileStepPanelComponent);
