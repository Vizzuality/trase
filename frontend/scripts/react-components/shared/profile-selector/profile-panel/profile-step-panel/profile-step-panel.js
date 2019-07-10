import { connect } from 'react-redux';
import ProfileStepPanelComponent from 'react-components/shared/profile-selector/profile-panel/profile-step-panel/profile-step-panel.component';
import {
  setProfilesPage,
  setProfilesActiveItem,
  clearProfilesPanel,
  setProfilesActiveTab,
  getProfilesSearchResults,
  setProfilesActiveItemWithSearch
} from 'react-components/shared/profile-selector/profile-selector.actions';
import { getActivePanelTabs } from 'react-components/shared/profile-selector/profile-panel/profile-step-panel/profile-step-panel.selectors';

const mapStateToProps = state => ({
  profileType: state.profileSelector.panels.types.activeItems.type,
  panels: state.profileSelector.panels,
  data: state.profileSelector.data,
  loading: state.profileSelector.loading,
  tabs: getActivePanelTabs(state)
});

const mapDispatchToProps = {
  setProfilesPage,
  setProfilesActiveItem,
  clearProfilesPanel,
  getSearchResults: getProfilesSearchResults,
  setProfilesSearchResult: setProfilesActiveItemWithSearch,
  getMoreItems: setProfilesPage,
  setProfilesActiveTab
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProfileStepPanelComponent);
