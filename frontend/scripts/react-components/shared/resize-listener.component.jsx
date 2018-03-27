import { Component } from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';

class ResizeListener extends Component {
  constructor(props) {
    super(props);

    this.state = {
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight
    };

    this.onPageResize = debounce(this.onPageResize.bind(this), 300);
  }

  componentDidMount() {
    window.addEventListener('resize', this.onPageResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onPageResize);
  }

  onPageResize() {
    this.setState({
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight
    });
  }

  render() {
    return this.props.children(this.state);
  }
}

ResizeListener.propTypes = {
  children: PropTypes.func.isRequired
};

export default ResizeListener;
