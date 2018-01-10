import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Home from 'react-components/home/home.component';
import { getURLFromParams, POST_SUBSCRIBE_NEWSLETTER } from 'utils/getURLFromParams';
import { getSliderContent } from 'actions/home.actions';

// Seens like an overkill to include into redux
function submitForm(email) {
  const body = new FormData();
  body.append('email', email);

  const url = getURLFromParams(POST_SUBSCRIBE_NEWSLETTER);
  return fetch(url, {
    method: 'POST',
    body
  })
    .then(res => (res.ok ? res.json() : Promise.reject(res.statusText)))
    .then((data) => {
      if (data.error) return Promise.reject(data.error);
      return Promise.resolve('Subscription successful');
    });
}

class HomeContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      message: null
    };
    props.getSliderContent('posts');
    props.getSliderContent('tweets');
    this.onSubmitNewsletter = this.onSubmitNewsletter.bind(this);
  }

  onSubmitNewsletter(email) {
    submitForm(email)
      .then(msg => this.setState({ message: msg }))
      .catch(err => this.setState({ message: `Error: ${err}` }));
  }

  render() {
    return (
      <Home
        message={this.state.message}
        onSubmitNewsletter={this.onSubmitNewsletter}
        {...this.props}
      />
    );
  }
}

HomeContainer.propTypes = {
  getSliderContent: PropTypes.func.isRequired
};

function mapStateToProps(state) {
  const { tweets, posts } = state.home;
  const parsedTweets = tweets.map(tweet => ({
    quote: tweet.text,
    quoteAuthor: tweet.screen_name
  }));
  const parsedPosts = posts.map(post => ({
    title: post.title,
    image: post.image_url
  }));
  return {
    tweets: parsedTweets,
    posts: parsedPosts
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ getSliderContent }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeContainer);
