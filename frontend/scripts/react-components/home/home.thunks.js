import { homeActions } from 'react-components/home/home.register';

export const getPostsContent = dispatch => dispatch(homeActions.getHomeContent('posts'));
export const getTestimonialsContent = dispatch =>
  dispatch(homeActions.getHomeContent('testimonials'));
export const getTweetsContent = dispatch => dispatch(homeActions.getHomeContent('tweets'));
