import get from 'lodash/get';

import { RESET_TOOL_STATE } from 'actions/tool.actions';
import { getHomeContent } from 'react-components/home/home.actions';

export const resetToolThunk = (dispatch, getState, { action }) => {
  const { type } = getState().location;

  // only reset if redirects to tool page not from tool page
  // and append action payload state with initial one
  if (action.type === 'tool' && type !== 'tool') {
    dispatch({ type: RESET_TOOL_STATE, payload: get(action, 'payload.query.state', {}) });
  }
};

export const getPostsContent = dispatch => dispatch(getHomeContent('posts'));
export const getTestimonialsContent = dispatch => dispatch(getHomeContent('testimonials'));
export const getTweetsContent = dispatch => dispatch(getHomeContent('tweets'));
