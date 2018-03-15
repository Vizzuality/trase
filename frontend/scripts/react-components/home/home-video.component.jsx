/* eslint-disable jsx-a11y/media-has-caption */

import React from 'react';
import PropTypes from 'prop-types';
import Plyr from 'plyr';
import entries from 'lodash/toPairs';

class HomeVideo extends React.PureComponent {
  constructor(props) {
    super(props);

    this.getRef = this.getRef.bind(this);
    this.setupPlyr = this.setupPlyr.bind(this);
    this.addEventListeners = this.addEventListeners.bind(this);
    this.destroyPlyr = this.destroyPlyr.bind(this);
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

  getRef(el) {
    this.selector = el;
  }

  setupPlyr() {
    this.plyr = new Plyr(this.selector, this.props.options);
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
  }

  addEventListeners() {
    const { events } = this.props;
    entries(events).forEach(([event, handler]) => this.plyr.on(event, () => handler(this.plyr)));
  }

  destroyPlyr() {
    if (this.plyr) this.plyr.destroy();
  }

  render() {
    return <video ref={this.getRef} controls crossOrigin="true" playsInline />;
  }
}

HomeVideo.propTypes = {
  videoId: PropTypes.string.isRequired,
  options: PropTypes.object,
  events: PropTypes.object
};

export default HomeVideo;
