import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { sendSubscriptionEmail } from 'react-components/shared/newsletter/newsletter.actions';
import Home from 'react-components/home/home.component';

function mapStateToProps(state) {
  const { tweets, posts, features } = state.home;
  const { message } = state.newsletter.home;
  const parsedTweets = tweets.map(tweet => ({
    id: tweet.id,
    text: tweet.text,
    author: tweet.screen_name
  }));
  const testimonials = tweets.map(tweet => ({
    quote: tweet.text,
    quoteAuthor: tweet.screen_name
  }));
  const parsedPosts = posts.map(post => ({
    title: post.title,
    image: post.image_url
  }));
  return {
    message,
    features,
    testimonials,
    tweets: parsedTweets,
    posts: parsedPosts
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ sendSubscriptionEmail }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
