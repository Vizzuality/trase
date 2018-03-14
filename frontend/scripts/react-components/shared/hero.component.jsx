import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import TwitterFeed from 'react-components/home/twitter-feed.component';
import AnimatedFlows from 'react-components/animated-flows/animated-flows.component';
import HomeVideo from 'react-components/home/home-video.component';

// old school name: https://en.wikipedia.org/wiki/Hero_image
class Hero extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showStory: true
    };

    this.videoEventHandlers = {
      pause: this.onPause,
      exitfullscreen: this.onExitFullScreen,
      ended: this.onEnded
    };

    this.onClickPlay = this.onClickPlay.bind(this);
    this.getVideoRef = this.getVideoRef.bind(this);
    this.closeStoryBox = this.closeStoryBox.bind(this);
  }

  onPause(plyr) {
    plyr.fullscreen.exit();
  }

  onExitFullScreen(plyr) {
    plyr.pause();
  }

  onEnded(plyr) {
    plyr.fullscreen.exit();
  }

  onClickPlay() {
    const { plyr } = this.video;

    if (plyr.fullscreen.active === false) {
      plyr.play();
      plyr.fullscreen.enter();
    }
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
          <a
            className="subtitle story-box-link"
            target="_blank"
            rel="noopener noreferrer"
            href={storyObj.completePostUrl}
          >
            See It Here
          </a>
        </figcaption>
      </div>
    );

    return (
      <div className={cx('c-hero', className)}>
        <div className="hero-content row align-middle">
          <div className="column small-12">
            <div className="hero-logo-container">
              <img src="/images/logos/new-logo-trase.svg" alt="TRASE" />
            </div>
            <h1 className="hero-title">Transparent supply chains for sustainable economies.</h1>
            <div className="hero-play-container">
              <HomeVideo
                className="c-home-video"
                ref={this.getVideoRef}
                videoId={homeVideo}
                events={this.videoEventHandlers}
              />
              <button className="hero-play-button" onClick={this.onClickPlay} />
              <span>Learn about Trase in 2 minutes</span>
            </div>
          </div>
          {showStory &&
            story && (
              <div className="layover">
                <StoryBox {...story} />
              </div>
            )}
          {(!showStory || !story) &&
            tweets && (
              <div className="layover">
                <TwitterFeed tweets={tweets} />
              </div>
            )}
        </div>
        <AnimatedFlows />
      </div>
    );
  }
}

Hero.propTypes = {
  className: PropTypes.string,
  story: PropTypes.object,
  tweets: PropTypes.array,
  onClickPlay: PropTypes.func,
  homeVideo: PropTypes.string
};

export default Hero;
