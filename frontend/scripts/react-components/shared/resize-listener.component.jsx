import { Component } from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';

import { BREAKPOINTS } from 'constants';

class ResizeListener extends Component {
  constructor(props) {
    super(props);

    this.state = this.getNewState();

    this.handlePageResize = debounce(this.handlePageResize.bind(this), 300);
  }

  componentDidMount() {
    window.addEventListener('resize', this.handlePageResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handlePageResize);
  }

  getNewState() {
    return {
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight,
      resolution: {
        isSmall: window.innerWidth <= BREAKPOINTS.small
      }
    };
  }

  handlePageResize() {
    this.setState(this.getNewState());
  }

  render() {
    return this.props.children(this.state);
  }
}

ResizeListener.propTypes = {
  children: PropTypes.func.isRequired
};

export default ResizeListener;
