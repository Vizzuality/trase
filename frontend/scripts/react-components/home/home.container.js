import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { sendSubscriptionEmail } from 'react-components/shared/newsletter/newsletter.actions';
import Home from 'react-components/home/home.component';

function mapStateToProps(state) {
  const { tweets, posts, features, testimonials, promotedPost } = state.home;
  const { message } = state.newsletter.home;
  return {
    message,
    posts,
    features,
    promotedPost,
    testimonials,
    tweets: tweets.length > 0 ? tweets : null
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ sendSubscriptionEmail }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
