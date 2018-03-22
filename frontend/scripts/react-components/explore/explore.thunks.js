import { redirect } from 'redux-first-router';
import { loadInitialData, selectContext } from 'actions/tool.actions';

export const loadInitialDataExplore = async (dispatch, getState) => {
  const { query = {} } = getState().location;
  const contextId = parseInt(query.contextId, 10);
  if (contextId) {
    return dispatch(loadInitialData()).then(() => dispatch(selectContext(contextId)));
  }
  return dispatch(loadInitialData());
};

export const redirectToExplore = async (dispatch, getState, { action }) => {
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
      return dispatch(redirect({ type: 'explore' }));
    }
  } else if (type === 'explore') {
    return previouslyVisitedExplorePage.set(Date.now());
  }
  return undefined;
};
