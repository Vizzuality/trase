import actions from 'actions';
import { GET_DISCLAIMER, GET_SITE_DIVE, getURLFromParams } from 'utils/getURLFromParams';

export function resize() {
  return {
    type: actions.SET_SANKEY_SIZE
  };
}

export function toggleMap() {
  return dispatch => {
    dispatch({
      type: actions.TOGGLE_MAP
    });
    dispatch({ type: actions.SET_SANKEY_SIZE });
  };
}

export function toggleMapLayerMenu() {
  return dispatch => {
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
  return dispatch => {
    const disclaimerLocal = localStorage.getItem('disclaimerVersion');

    const url = getURLFromParams(GET_DISCLAIMER);
    fetch(url)
      .then(resp => resp.text())
      .then(resp => JSON.parse(resp))
      .then(disclaimer => {
        if (disclaimerLocal !== null && parseInt(disclaimerLocal, 10) >= disclaimer.version) {
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

export function displayStoryModal(storyId) {
  return dispatch => {
    fetch(`${getURLFromParams(GET_SITE_DIVE)}/${storyId}`)
      .then(resp => {
        if (resp.ok) return resp.text();
        throw new Error(resp.statusText);
      })
      .then(resp => JSON.parse(resp))
      .then(({ data }) =>
        dispatch({
          type: actions.DISPLAY_STORY_MODAL,
          payload: {
            visibility: false,
            modalParams: data
          }
        })
      )
      .catch(err => {
        console.error(err);
        return dispatch({
          type: actions.DISPLAY_STORY_MODAL,
          payload: {
            visibility: false,
            modalParams: null
          }
        });
      });
  };
}
