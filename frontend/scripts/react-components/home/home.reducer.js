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
   * { title, titleColor, description, date, imageUrl, highlighted, completePostUrl }
   */
  ],
  features: [
  /**
   * { title, titleColor, description, date, imageUrl, highlighted, completePostUrl }
   */
  ],
  testimonials: [
  /**
   * { quote, authorName, authorTitle, imageUrl }
   */
  ],
  promotedPost: null
  /**
   * { title, titleColor, description, date, imageUrl, highlighted, completePostUrl }
   */
};

const homeReducer = {
  [HOME__SET_CONTENT](state, action) {
    const { type, data } = action.payload;
    return { ...state, [type]: clone(data) };
  }
};

export default createReducer(initialState, homeReducer);
