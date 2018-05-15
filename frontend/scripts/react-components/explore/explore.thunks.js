import { redirect } from 'redux-first-router';
import {
  selectContextById,
  setContextIsUserSelected,
  SET_CONTEXT_IS_USER_SELECTED
} from 'actions/app.actions';

/**
 * @deprecated this should be used to load legacy URLs only. New code will use internal state instead
 *
 * @param dispatch
 * @param getState
 */
export const setContextForExplorePage = (dispatch, getState) => {
  const { query = {} } = getState().location;
  const contextId = parseInt(query.contextId, 10);
  if (contextId) {
    dispatch(selectContextById(contextId));
    dispatch(setContextIsUserSelected(true));
  }
};

export const redirectToExplore = (dispatch, getState, { action }) => {
  const { type } = getState().location;
  const toolPages = ['tool', 'map'];
  const previouslyVisitedExplorePage = {
    key: 'previouslyVisitedExplorePage__TRASE_EARTH',
    get() {
      return localStorage.getItem(this.key);
    },
    set(key) {
      return localStorage.setItem(this.key, key);
    }
  };

  if (toolPages.includes(action.type)) {
    if (!previouslyVisitedExplorePage.get()) {
      previouslyVisitedExplorePage.set(Date.now());
      dispatch({
        type: SET_CONTEXT_IS_USER_SELECTED,
        payload: false
      });
      dispatch(redirect({ type: 'explore' }));
    }
  } else if (type === 'explore') {
    previouslyVisitedExplorePage.set(Date.now());
  }
};
