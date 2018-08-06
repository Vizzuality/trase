import createReducer from 'utils/createReducer';
import { HOME__SET_CONTENT } from './home.actions';

const initialState = {
  tweets: [
    /**
     * { id, text, screen_name, created_at, image_url }
     */
  ],
  posts: [
    /**
     * { title, titleColor, description, date, imageUrl, highlighted, completePostUrl }
     */
  ],
  testimonials: [
    /**
     * { quote, authorName, authorTitle, imageUrl }
     */
  ]
};

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
