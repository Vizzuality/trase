import React, { Suspense } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Banner from 'react-components/home/banner/banner.component';
// import TwitterFeed from 'react-components/home/twitter-feed/twitter-feed.component';
import AnimatedFlows from 'react-components/animated-flows/animated-flows.component';
import Heading from 'react-components/shared/heading/heading.component';
import InView from 'react-components/shared/in-view.component';
import { ImgBackground } from 'react-components/shared/img';

import './hero.scss';

const HomeVideo = React.lazy(() => import('../../home/home-video/home-video.component'));

// old school name: https://en.wikipedia.org/wiki/Hero_image
class Hero extends React.Component {
  state = {
    showStory: true
  };

  onClickPlay = () => {
    const { homeVideo, onPlayVideo } = this.props;
    onPlayVideo(homeVideo);
    this.video.play();
  };

  getVideoRef = ref => {
    this.video = ref;
  };

  closeStoryBox = () => {
    this.setState({ showStory: false });
  };

  render() {
    const { showStory } = this.state;
    const { className, story, homeVideo } = this.props;
    // tweets,
    const isLegacyBrowser =
      (!window.ActiveXObject && 'ActiveXObject' in window) ||
      /bot|google|baidu|bing|msn|duckduckbot|teoma|slurp|yandex/i.test(navigator.userAgent);
    const StoryBox = storyObj => (
      <div className="story-box">
        <button className="story-box-close" onClick={this.closeStoryBox} />
        <ImgBackground as="figure" className="story-box-image" src={storyObj.imageUrl} />
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
    // Remove -banner class when we remove the banner
    return (
      <InView>
        {({ ref, inView }) => (
          <div className={cx('c-hero', className)} ref={ref}>
            {inView && <AnimatedFlows />}
            <div className="hero-content row align-middle">
              <div className="column small-12">
                <div className="hero-logo-container">
                  <ImgBackground
                    className="hero-trase-logo"
                    src="/images/logos/new-logo-trase.svg"
                    alt="TRASE"
                  />
                </div>
                <h1 className="hero-title">Transparency for Sustainable Economies</h1>
                <Suspense fallback={null}>
                  {!isLegacyBrowser && (
                    <div className="hero-play-container">
                      <HomeVideo
                        className="c-home-video"
                        ref={this.getVideoRef}
                        videoId={homeVideo}
                      />
                      <button className="hero-play-button" onClick={this.onClickPlay} />
                      <span>Learn about Trase in 2 minutes</span>
                    </div>
                  )}
                </Suspense>
              </div>
              {showStory && story && (
                <div className="layover">
                  <StoryBox {...story} />
                </div>
              )}
              {inView && (
                // (!showStory || !story) && tweets &&
                <div className="layover -banner">
                  <Banner />
                  {/* <TwitterFeed tweets={tweets} /> */}
                </div>
              )}
            </div>
          </div>
        )}
      </InView>
    );
  }
}

Hero.propTypes = {
  story: PropTypes.object,
  tweets: PropTypes.array,
  className: PropTypes.string,
  homeVideo: PropTypes.string,
  onPlayVideo: PropTypes.func.isRequired
};

export default Hero;
