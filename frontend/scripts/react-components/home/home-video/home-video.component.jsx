/* eslint-disable jsx-a11y/media-has-caption */

import React from 'react';
import PropTypes from 'prop-types';
import Plyr from 'plyr/dist/plyr.polyfilled.min';

import './home-video.scss';

class HomeVideo extends React.PureComponent {
  constructor(props) {
    super(props);

    this.videoReady = false;
    this.playVideoWhenReady = false;

    this.getVideoRef = this.getVideoRef.bind(this);

    this.onEnded = this.onEnded.bind(this);
    this.onExitFullScreen = this.onExitFullScreen.bind(this);
    this.onEnterFullScreen = this.onEnterFullScreen.bind(this);
    this.onReady = this.onReady.bind(this);
  }

  componentDidMount() {
    this.setupPlyr();
    this.setupSource(this.props.videoId);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.videoId !== this.props.videoId && this.plyr) {
      this.setupSource(this.props.videoId);
    }
  }

  componentWillUnmount() {
    this.destroyPlyr();
  }

  onExitFullScreen() {
    this.plyr.pause();
    this.plyr.elements.container.classList.remove('-is-fullscreen');
  }

  onEnterFullScreen() {
    this.plyr.elements.container.classList.add('-is-fullscreen');
  }

  onEnded() {
    this.plyr.fullscreen.exit();
  }

  onReady() {
    this.videoReady = true;
  }

  getVideoRef(el) {
    this.videoElement = el;
  }

  setupPlyr() {
    this.plyr = new Plyr(this.videoElement);
    this.addEventListeners();
  }

  setupSource(videoId) {
    this.plyr.source = {
      type: 'video',
      sources: [
        {
          src: videoId,
          provider: 'youtube'
        }
      ]
    };
    this.plyr.config.youtube.noCookie = true;
  }

  addEventListeners() {
    this.plyr.on('ended', this.onEnded);
    this.plyr.on('exitfullscreen', this.onExitFullScreen);
    this.plyr.on('enterfullscreen', this.onEnterFullScreen);
    this.plyr.on('ready', this.onReady);
  }

  destroyPlyr() {
    if (this.plyr) this.plyr.destroy();
  }

  play() {
    // we cannot schedule firing video later because initiating fullscreen won't work
    // as it must be initiated by user gesture, that's why can only play video manually
    // when it's ready
    if (this.videoReady) {
      this.plyr.play();
      this.plyr.fullscreen.enter();
    }
  }

  render() {
    return <video ref={this.getVideoRef} controls crossOrigin="true" playsInline />;
  }
}

HomeVideo.propTypes = {
  videoId: PropTypes.string.isRequired
};

export default HomeVideo;
