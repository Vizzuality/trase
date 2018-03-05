import { RESET_TOOL_STATE } from 'actions/tool.actions';
import { getHomeContent } from 'react-components/home/home.actions';

export const resetToolThunk = (dispatch, getState) => {
  const { query = {} } = getState().location;
  if (!query.state) {
    dispatch({ type: RESET_TOOL_STATE, query });
  }
};

export const getPostsContent = dispatch => dispatch(getHomeContent('posts'));
export const getTestimonialsContent = dispatch => dispatch(getHomeContent('testimonials'));
export const getTweetsContent = dispatch => dispatch(getHomeContent('tweets'));
