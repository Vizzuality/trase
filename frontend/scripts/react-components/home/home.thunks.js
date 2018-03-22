import get from 'lodash/get';
import { updateScroll } from 'redux-first-router';

import { loadInitialData, RESET_TOOL_STATE } from 'actions/tool.actions';
import { getHomeContent } from 'react-components/home/home.actions';

export const resetToolThunk = async (dispatch, getState, { action }) => {
  const { type } = getState().location;

  // only reset if redirects to tool page not from tool page
  // and append action payload state with initial one
  if (action.type === 'tool' && type !== 'tool') {
    dispatch({ type: RESET_TOOL_STATE, payload: get(action, 'payload.query.state', {}) });
  }
};

export const scrollTop = async (dispatch, getState) => {
  const { prev, pathname } = getState().location;
  if (prev.pathname !== pathname) updateScroll();
};

export const getPostsContent = async dispatch => dispatch(getHomeContent('posts'));
export const getTestimonialsContent = async dispatch => dispatch(getHomeContent('testimonials'));
export const getTweetsContent = async dispatch => dispatch(getHomeContent('tweets'));
export const loadInitialDataHome = async dispatch => dispatch(loadInitialData());
