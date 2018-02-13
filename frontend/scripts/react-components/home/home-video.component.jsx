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

  getPlyr() {
    return Plyr.get(this.selector)[0];
  }

  setupPlyr() {
    const plyr = Plyr.setup(this.selector, this.props.options)[0];
    this.addEventListeners(plyr);
  }

  addEventListeners(plyr) {
    const { events } = this.props;
    entries(events).forEach(([event, handler]) => plyr.on(event, () => handler(plyr)));
  }

  destroyPlyr() {
    this.getPlyr().destroy();
  }

  render() {
    const { type, videoId, children, className } = this.props;
    return (
      <div className={className} ref={this.getRef} data-type={type} data-video-id={videoId}>
        {children(this.getPlyr())}
      </div>
    );
  }
}

HomeVideo.propTypes = {
  type: PropTypes.string,
  videoId: PropTypes.string.isRequired,
  children: PropTypes.func,
  options: PropTypes.object,
  className: PropTypes.string,
  events: PropTypes.object
};

HomeVideo.defaultProps = {
  type: 'youtube'
};

export default HomeVideo;
