import createReducer from 'utils/createReducer';
import initialState from './home.initial-state';
import { HOME__SET_CONTENT } from './home.actions';

const homeReducer = {
  [HOME__SET_CONTENT](state, action) {
    const { type, data } = action.payload;
    return { ...state, [type]: [...data] };
  }
};

const homeReducerTypes = PropTypes => ({
  tweets: PropTypes.arrayOf(PropTypes.object).isRequired,
  posts: PropTypes.arrayOf(PropTypes.object).isRequired,
  testimonials: PropTypes.arrayOf(PropTypes.object).isRequired
});

export default createReducer(initialState, homeReducer, homeReducerTypes);
