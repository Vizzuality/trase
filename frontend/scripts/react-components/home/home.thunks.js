import { loadInitialData, RESET_TOOL_STATE } from 'actions/tool.actions';
import { getHomeContent } from 'react-components/home/home.actions';

export const resetToolThunk = (dispatch, getState, { action }) => {
  const { type, query = {}, prev } = getState().location;
  if (action.type === 'tool' && prev.type && type !== 'tool') {
    if (!query.state) {
      dispatch({ type: RESET_TOOL_STATE, query });
    }
  }
};

export const getPostsContent = dispatch => dispatch(getHomeContent('posts'));
export const getTestimonialsContent = dispatch => dispatch(getHomeContent('testimonials'));
export const getTweetsContent = dispatch => dispatch(getHomeContent('tweets'));
export const loadInitialDataHome = dispatch => dispatch(loadInitialData());
