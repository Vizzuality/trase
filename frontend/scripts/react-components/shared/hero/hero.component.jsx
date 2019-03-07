import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import TwitterFeed from 'react-components/home/twitter-feed/twitter-feed.component';
import AnimatedFlows from 'react-components/animated-flows/animated-flows.component';
import HomeVideo from 'react-components/home/home-video/home-video.component';
import Heading from 'react-components/shared/heading/heading.component';

import './hero.scss';

// old school name: https://en.wikipedia.org/wiki/Hero_image
class Hero extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showStory: true
    };

    this.onClickPlay = this.onClickPlay.bind(this);
    this.getVideoRef = this.getVideoRef.bind(this);
    this.closeStoryBox = this.closeStoryBox.bind(this);
  }

  onClickPlay() {
    this.video.play();
  }

  getVideoRef(ref) {
    this.video = ref;
  }

  closeStoryBox() {
    this.setState({ showStory: false });
  }

  render() {
    const { showStory } = this.state;
    const { className, story, tweets, homeVideo } = this.props;
    const StoryBox = storyObj => (
      <div className="story-box">
        <button className="story-box-close" onClick={this.closeStoryBox} />
        <figure
          className="story-box-image"
          style={{ backgroundImage: `url(${storyObj.imageUrl})` }}
        />
        <figcaption className="story-box-content">
          <p className="story-box-title">{storyObj.title}</p>
          <Heading variant="mono" color="pink" size="sm">
            <a
              className="story-box-link"
              target="_blank"
              rel="noopener noreferrer"
              href={storyObj.completePostUrl}
            >
              See It Here
            </a>
          </Heading>
        </figcaption>
      </div>
    );

    return (
      <div className={cx('c-hero', className)}>
        <AnimatedFlows />
        <div className="hero-content row align-middle">
          <div className="column small-12">
            <div className="hero-logo-container">
              <img src="/images/logos/new-logo-trase.svg" alt="TRASE" />
            </div>
            <h1 className="hero-title">Transparent supply chains for sustainable economies.</h1>
            <div className="hero-play-container">
              <HomeVideo className="c-home-video" ref={this.getVideoRef} videoId={homeVideo} />
              <button className="hero-play-button" onClick={this.onClickPlay} />
              <span>Learn about Trase in 2 minutes</span>
            </div>
          </div>
          {showStory && story && (
            <div className="layover">
              <StoryBox {...story} />
            </div>
          )}
          {(!showStory || !story) && tweets && (
            <div className="layover">
              <TwitterFeed tweets={tweets} />
            </div>
          )}
        </div>
      </div>
    );
  }
}

Hero.propTypes = {
  className: PropTypes.string,
  story: PropTypes.object,
  tweets: PropTypes.array,
  homeVideo: PropTypes.string
};

export default Hero;
