/* eslint-disable react/no-danger */
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { Transition } from 'react-transition-group';
import AuthorFooter from '../author-footer/author-footer.component';

import './twitter-feed.scss';

class TwitterFeed extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      current: 0
    };
    this.setFeedInterval = this.setFeedInterval.bind(this);
  }

  componentDidMount() {
    this.setFeedInterval();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.tweets !== this.props.tweets) {
      this.setFeedInterval();
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  setFeedInterval() {
    const {
      tweets: { length }
    } = this.props;
    if (this.interval) clearInterval(this.interval);
    this.interval = setInterval(
      () => this.setState(state => ({ current: (state.current + 1) % (length || 1) })),
      7000
    );
  }

  render() {
    const { tweets } = this.props;
    const { current } = this.state;
    return (
      <React.Fragment>
        <div className="c-twitter-feed">
          {tweets.map((tweet, i) => (
            <Transition key={i} in={i === current} timeout={300}>
              {transition => (
                <div className={cx('tweet-box', `-${transition}`)}>
                  <div
                    className="tweet-box-content"
                    dangerouslySetInnerHTML={{ __html: tweet.text }}
                  />
                  <AuthorFooter details={tweet.screen_name} imageUrl={tweet.profilePictureUrl} />
                </div>
              )}
            </Transition>
          ))}
        </div>
        <div className="twitter-token">
          <span>
            <svg className="icon icon-twitter">
              <use xlinkHref="#icon-twitter" />
            </svg>
          </span>
        </div>
      </React.Fragment>
    );
  }
}

TwitterFeed.propTypes = {
  tweets: PropTypes.array
};

export default TwitterFeed;
