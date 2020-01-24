import { getHomeContent } from 'react-components/home/home.register';

export const getPostsContent = dispatch => dispatch(getHomeContent('posts'));
export const getTestimonialsContent = dispatch => dispatch(getHomeContent('testimonials'));
export const getTweetsContent = dispatch => dispatch(getHomeContent('tweets'));
