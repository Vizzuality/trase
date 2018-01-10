import actions from 'actions';

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
  ]
};

export default function (state = initialState, action) {
  switch (action.type) {
    case actions.SET_SLIDER_CONTENT: {
      const { type, data } = action.payload;
      return { ...state, [type]: [...data] };
    }
    default: {
      return state;
    }
  }
}
