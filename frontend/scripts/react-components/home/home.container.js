import { connect } from 'react-redux';
import Home from 'react-components/home/home.component';

function mapStateToProps(state) {
  const { tweets, posts, testimonials } = state.home;
  const INSIGHTS = ['INSIGHT', 'INFO BRIEF', 'ISSUE BRIEF', 'LONGER READ'];
  const promotedPost = posts.find(post => post.highlighted);
  const blogPosts = posts.filter(post => !post.highlighted && !INSIGHTS.includes(post.category));
  const insightsPosts = posts.filter(post => !post.highlighted && INSIGHTS.includes(post.category));
  return {
    blogPosts,
    insightsPosts,
    promotedPost,
    testimonials,
    tweets: tweets.length > 0 ? tweets : null
  };
}

export default connect(mapStateToProps)(Home);
