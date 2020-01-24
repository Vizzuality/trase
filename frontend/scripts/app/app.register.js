import reducerRegistry from 'reducer-registry';
import reducer from './app.reducer';

reducerRegistry.register('app', reducer);

// not ideal because you have to change in two places, but still better than changing across all app
export {
  SET_CONTEXT,
  LOAD_TOOLTIP,
  SET_TOOLTIPS,
  SHOW_DISCLAIMER,
  TOGGLE_DROPDOWN,
  TOGGLE_MAP_LAYERS_MENU,
  CLOSE_STORY_MODAL,
  SET_SEARCH_TERM,
  LOAD_SEARCH_RESULTS,
  SET_CONTEXTS,
  SET_CONTEXT_IS_USER_SELECTED,
  APP__SET_LOADING,
  APP__TRANSIFEX_LANGUAGES_LOADED,
  APP__SET_TOP_DESTINATION_COUNTRIES,
  APP__SET_TOP_DESTINATION_COUNTRIES_LOADING,
  setContextIsUserSelected,
  selectContextById,
  resize,
  changeLayout,
  loadTooltip,
  closeStoryModal,
  loadDisclaimer,
  toggleDropdown,
  resetSearchResults,
  setLanguage,
  loadSearchResults,
  selectYears,
  setTransifexLanguages,
  getTopCountries
} from './app.actions';
