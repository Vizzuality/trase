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
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.options !== this.props.options) {
      this.destroyPlyr();
      this.setupPlyr();
    }
  }

  componentWillUnmount() {
    this.destroyPlyr();
  }

  getRef(el) {
    this.selector = el;
  }

  setupPlyr() {
    this.plyr = Plyr.setup(this.selector, this.props.options)[0];
    this.addEventListeners();
  }

  addEventListeners() {
    const { events } = this.props;
    entries(events).forEach(([event, handler]) => this.plyr.on(event, () => handler(this.plyr)));
  }

  destroyPlyr() {
    this.plyr.destroy();
  }

  render() {
    const { type, videoId, className } = this.props;
    return <div className={className} ref={this.getRef} data-type={type} data-video-id={videoId} />;
  }
}

HomeVideo.propTypes = {
  type: PropTypes.string,
  videoId: PropTypes.string.isRequired,
  options: PropTypes.object,
  className: PropTypes.string,
  events: PropTypes.object
};

HomeVideo.defaultProps = {
  type: 'youtube'
};

export default HomeVideo;
