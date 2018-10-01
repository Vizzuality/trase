import { redirect } from 'redux-first-router';
import { selectContextById, setContextIsUserSelected } from 'actions/app.actions';

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

  const urlHasSankeyState = !!(
    action.meta &&
    action.meta.query &&
    action.meta.query.selectedContextId
  );

  if (toolPages.includes(action.type)) {
    if (!previouslyVisitedExplorePage.get() && !urlHasSankeyState) {
      previouslyVisitedExplorePage.set(Date.now());
      //     dispatch(setContextIsUserSelected(false));
      dispatch(redirect({ type: 'explore' }));
    }
  } else if (type === 'explore') {
    previouslyVisitedExplorePage.set(Date.now());
  }
};
