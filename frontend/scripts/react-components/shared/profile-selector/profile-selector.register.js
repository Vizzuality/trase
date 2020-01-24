import reducerRegistry from 'reducer-registry';
import sagaRegistry from 'saga-registry';
import reducer from './profile-selector.reducer';
import saga from './profile-panel/profile-panel.saga';

reducerRegistry.register('profileSelector', reducer);
sagaRegistry.register('profilePanel', saga);

// not ideal because you have to change in two, but still better than changing across all app
export {
  PROFILES__SET_MORE_PANEL_DATA,
  PROFILES__SET_PANEL_DATA,
  PROFILES__SET_ACTIVE_STEP,
  PROFILES__SET_ACTIVE_ITEM,
  PROFILES__SET_ACTIVE_TAB,
  PROFILES__SET_PANEL_TABS,
  PROFILES__SET_PANEL_PAGE,
  PROFILES__SET_LOADING_ITEMS,
  PROFILES__GET_SEARCH_RESULTS,
  PROFILES__SET_SEARCH_RESULTS,
  PROFILES__SET_ACTIVE_ITEM_WITH_SEARCH,
  openModal,
  closeModal,
  setProfilesActiveStep,
  setProfilesActiveItem,
  setProfilesActiveItemWithSearch,
  setProfilesActiveTab,
  setProfilesPage,
  setProfilesLoadingItems,
  goToProfile,
  getProfilesSearchResults
} from './profile-selector.actions';
