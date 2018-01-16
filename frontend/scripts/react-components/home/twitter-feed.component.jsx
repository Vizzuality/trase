/* eslint-disable react/no-danger */
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { Transition } from 'react-transition-group';

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
    const { tweets: { length } } = this.props;
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
          {
            tweets.map((tweet, i) => (
              <Transition key={tweet.id} in={i === current} timeout={300}>
                {
                  transition => (
                    <div className={cx('tweet-box', `-${transition}`)}>
                      <div
                        className="tweet-box-content"
                        dangerouslySetInnerHTML={{ __html: tweet.text }}
                      />
                      <div className="c-author-footer">
                        <p className="author-details">
                          {tweet.screen_name}
                        </p>
                        <div
                          className="author-avatar"
                          style={{ backgroundImage: tweet.image_url && `url(${tweet.image_url})` }}
                        />
                      </div>
                    </div>
                  )
                }
              </Transition>
            ))
          }
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
