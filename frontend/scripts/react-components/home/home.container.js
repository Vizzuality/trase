import { connect } from 'react-redux';
import Home from 'react-components/home/home.component';
import { BREAKPOINTS, HOME_VIDEO } from 'constants';

function mapStateToProps(state) {
  const { query = {} } = state.location;
  const { tweets, posts, testimonials } = state.home;
  // not ideal, we could use redux-responsive if we need more changes like the one below
  const isSmallResolution = window.innerWidth <= BREAKPOINTS.small;
  console.log('isSmallResolution', window.innerWidth);
  const INSIGHTS = ['INSIGHT', 'INFO BRIEF', 'ISSUE BRIEF', 'LONGER READ'];
  const promotedPost = posts.find(post => post.highlighted);
  const blogPosts = posts.filter(
    post => !(post.highlighted && !isSmallResolution) && !INSIGHTS.includes(post.category)
  );
  const insightsPosts = posts.filter(
    post => !(post.highlighted && !isSmallResolution) && INSIGHTS.includes(post.category)
  );
  const homeVideo = HOME_VIDEO[query.lang] || HOME_VIDEO.en;
  return {
    homeVideo,
    blogPosts,
    insightsPosts,
    promotedPost,
    testimonials,
    tweets: tweets.length > 0 ? tweets : null
  };
}

export default connect(mapStateToProps)(Home);
