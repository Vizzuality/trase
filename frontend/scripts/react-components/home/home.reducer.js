import clone from 'lodash/clone';
import { createReducer } from 'store';
import { HOME__SET_CONTENT } from './home.actions';

const initialState = {
  tweets: [
  /**
   * { id, text, screen_name, created_at, image_url }
   */
  ],
  posts: [
  /**
   * { title, title_color, description, date, image_url, highlighted, complete_post_url }
   */
  ],
  features: [
  /**
   * { title, title_color, description, date, image_url, highlighted, complete_post_url }
   */
  ],
  testimonials: [
  /**
   * { quote, authorName, authorTitle, imageUrl }
   */
  ],
  promotedPost: null
  /**
   * { title, title_color, description, date, image_url, highlighted, complete_post_url }
   */
};

const homeReducer = {
  [HOME__SET_CONTENT](state, action) {
    const { type, data } = action.payload;
    return { ...state, [type]: clone(data) };
  }
};

export default createReducer(initialState, homeReducer);
