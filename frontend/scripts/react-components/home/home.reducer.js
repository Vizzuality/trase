import { createReducer } from 'store';
import { HOME__SET_CONTENT } from './home.actions';

const initialState = {
  tweets: [
  /**
   * { id, text, screen_name, created_at }
   */
  ],
  posts: [
  /**
   * { title, title_color, description, date, image_url, highlighted, complete_post_url }
   */
  ],
  features: Array(12)
    .fill(0)
    .map((zero, index) => ({ image: false, quote: `Lorem Ipsum${index}` })),
  storyBox: {
    title: 'Our 2017 data analysis yearbook was just released!',
    image: 'images/mocks/one.jpg'
  }
};

const homeReducer = {
  [HOME__SET_CONTENT](state, action) {
    const { type, data } = action.payload;
    return { ...state, [type]: [...data] };
  }
};

export default createReducer(initialState, homeReducer);
