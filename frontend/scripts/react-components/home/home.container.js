import { connect } from 'react-redux';
import Home from 'react-components/home/home.component';

function mapStateToProps(state) {
  const { tweets, posts, features, testimonials, promotedPost } = state.home;
  return {
    posts,
    features,
    promotedPost,
    testimonials,
    tweets: tweets.length > 0 ? tweets : null
  };
}

export default connect(mapStateToProps)(Home);
