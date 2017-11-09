import actions from 'actions';
import {
  getURLFromParams,
  GET_DISCLAIMER
} from 'utils/getURLFromParams';

export function resize() {
  return {
    type: actions.SET_SANKEY_SIZE
  };
}

export function toggleMap() {
  return (dispatch) => {
    dispatch({
      type: actions.TOGGLE_MAP
    });
    dispatch({ type: actions.SET_SANKEY_SIZE });
  };
}

export function toggleMapLayerMenu() {
  return (dispatch) => {
    dispatch({
      type: actions.TOGGLE_MAP_LAYERS_MENU
    });
    dispatch({ type: actions.SET_SANKEY_SIZE });
  };
}

export function loadTooltip() {
  return {
    type: actions.LOAD_TOOLTIP
  };
}

export function closeStoryModal() {
  return {
    type: actions.CLOSE_STORY_MODAL
  };
}

export function loadDisclaimer() {
  return (dispatch) => {
    const disclaimerLocal = localStorage.getItem('disclaimerVersion');

    const url = getURLFromParams(GET_DISCLAIMER);
    fetch(url)
      .then(resp => resp.text())
      .then(resp => JSON.parse(resp))
      .then(disclaimer => {
        if (disclaimerLocal !== null && parseInt(disclaimerLocal) >= disclaimer.version) {
          return;
        }

        localStorage.setItem('disclaimerVersion', disclaimer.version);

        dispatch({
          type: actions.SHOW_DISCLAIMER,
          disclaimerContent: disclaimer.content
        });
      });
  };
}

export function toggleDropdown(dropdownId) {
  return {
    type: actions.TOGGLE_DROPDOWN,
    dropdownId
  };
}
