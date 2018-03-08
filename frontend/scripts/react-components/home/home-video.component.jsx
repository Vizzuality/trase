import React from 'react';
import PropTypes from 'prop-types';
import Plyr from 'plyr';
import entries from 'lodash/toPairs';
import cx from 'classnames';

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
  }

  componentDidUpdate(prevProps) {
    if (prevProps.videoId !== this.props.videoId && this.plyr) {
      this.plyr.source = {
        type: 'video',
        sources: [
          {
            src: this.props.videoId,
            provider: 'youtube'
          }
        ]
      };
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

  addEventListeners() {
    const { events } = this.props;
    entries(events).forEach(([event, handler]) => this.plyr.on(event, () => handler(this.plyr)));
  }

  destroyPlyr() {
    if (this.plyr) this.plyr.destroy();
  }

  render() {
    const { videoId, origin, className } = this.props;
    return (
      <div ref={this.getRef} className={cx('plyr__video-embed', className)} id="player">
        <iframe
          title="home video"
          src={`https://www.youtube.com/embed/${videoId}?origin=${origin}&amp;iv_load_policy=3&amp;modestbranding=1&amp;playsinline=1&amp;showinfo=0&amp;rel=0&amp;enablejsapi=1`}
          allowFullScreen
        />
      </div>
    );
  }
}

HomeVideo.propTypes = {
  origin: PropTypes.string,
  videoId: PropTypes.string.isRequired,
  options: PropTypes.object,
  events: PropTypes.object,
  className: PropTypes.string
};

HomeVideo.defaultProps = {
  origin: window.location.origin
};

export default HomeVideo;
