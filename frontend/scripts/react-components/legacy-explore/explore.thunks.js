import { redirect } from 'redux-first-router';

export const redirectToExplore = (dispatch, getState, { action }) => {
  if (action.meta.location?.kind === 'redirect' || ENABLE_REDESIGN_PAGES) {
    return;
  }

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
    Object.keys(action.meta.query).length > 0
  );

  if (toolPages.includes(action.type)) {
    if (!previouslyVisitedExplorePage.get() && !urlHasSankeyState) {
      previouslyVisitedExplorePage.set(Date.now());
      const redirectQuery = action.payload && action.payload.query && action.payload.query.state;
      dispatch(redirect({ type: 'explore', payload: { query: redirectQuery } }));
    }
  } else if (type === 'explore') {
    previouslyVisitedExplorePage.set(Date.now());
  }
};
