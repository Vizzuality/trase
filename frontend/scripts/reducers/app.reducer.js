import {
  DISPLAY_STORY_MODAL,
  LOAD_TOOLTIP,
  SET_SANKEY_SIZE,
  SET_TOOLTIPS,
  SHOW_DISCLAIMER,
  TOGGLE_DROPDOWN,
  TOGGLE_MAP_LAYERS_MENU
} from 'actions/app.actions';
import { createReducer } from 'store';

const initialState = {
  windowSize: [window.innerWidth, window.innerHeight],
  isMapLayerVisible: false,
  isAppMenuVisible: false,
  tooltipCheck: 0,
  tooltips: null,
  currentDropdown: null,
  modal: {
    visibility: false,
    modalParams: null
  }
};

const isSankeyExpanded = state => state.isMapLayerVisible !== true && state.isMapVisible !== true;

const appReducer = {
  [SET_SANKEY_SIZE](state) {
    if (isSankeyExpanded(state)) {
      return Object.assign({}, state, {
        sankeySize: [window.innerWidth - 392, window.innerHeight - 180]
      });
    }
    return state;
  },
  [TOGGLE_MAP_LAYERS_MENU](state) {
    return Object.assign({}, state, { isMapLayerVisible: !state.isMapLayerVisible });
  },
  [LOAD_TOOLTIP](state) {
    return Object.assign({}, state, { tooltipCheck: (state.tooltipCheck || 0) + 1 });
  },
  [SET_TOOLTIPS](state, action) {
    return Object.assign({}, state, { tooltips: action.payload });
  },
  [SHOW_DISCLAIMER](state, action) {
    return Object.assign({}, state, {
      modal: {
        visibility: true,
        modalParams: {
          description: action.disclaimerContent
        }
      }
    });
  },
  [TOGGLE_DROPDOWN](state, action) {
    const currentDropdown = action.dropdownId === state.currentDropdown ? null : action.dropdownId;
    return Object.assign({}, state, { currentDropdown });
  },
  [DISPLAY_STORY_MODAL](state, action) {
    return { ...state, modal: action.payload };
  }
};

const appReducerTypes = PropTypes => ({
  windowSize: PropTypes.arrayOf(PropTypes.number).isRequired,
  isMapLayerVisible: PropTypes.bool,
  isAppMenuVisible: PropTypes.bool,
  tooltipCheck: PropTypes.number,
  tooltips: PropTypes.object,
  currentDropdown: PropTypes.string,
  modal: PropTypes.shape({
    visibility: PropTypes.bool,
    modalParams: PropTypes.object
  }).isRequired
});

export default createReducer(initialState, appReducer, appReducerTypes);
