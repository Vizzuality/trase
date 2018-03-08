import { connect } from 'react-redux';
import Home from 'react-components/home/home.component';
import { HOME_VIDEO } from 'constants';

function mapStateToProps(state) {
  const { query = {} } = state.location;
  const { tweets, posts, testimonials } = state.home;
  const INSIGHTS = ['INSIGHT', 'INFO BRIEF', 'ISSUE BRIEF', 'LONGER READ'];
  const promotedPost = posts.find(post => post.highlighted);
  const blogPosts = posts.filter(post => !post.highlighted && !INSIGHTS.includes(post.category));
  const insightsPosts = posts.filter(post => !post.highlighted && INSIGHTS.includes(post.category));
  const homeVideo = HOME_VIDEO[query.lang] || HOME_VIDEO.en;
  return {
    homeVideo,
    blogPosts,
    insightsPosts,
    promotedPost,
    testimonials,
    selectedContextId: state.tool.selectedContextId,
    tweets: tweets.length > 0 ? tweets : null
  };
}

export default connect(mapStateToProps)(Home);
