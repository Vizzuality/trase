import { computeStateQueryParams } from 'utils/stateURL';
import { getHomeContent } from 'react-components/home/home.actions';
import actions from 'actions';

export const resetToolThunk = (dispatch, getState) => {
  const { query = {} } = getState().location;
  if (!query.state) {
    const payload = computeStateQueryParams({}, query);
    dispatch({ type: actions.RESET_TOOL_STATE, payload });
  }
};

export const getPostsContent = dispatch => dispatch(getHomeContent('posts'));
export const getTweetsContent = dispatch => dispatch(getHomeContent('tweets'));
