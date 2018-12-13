import React from 'react';
import PropTypes from 'prop-types';

class ErrorCatch extends React.PureComponent {
  state = {
    error: null
  };

  componentDidCatch(error) {
    this.setState({ error });
  }

  render() {
    const { children, renderFallback } = this.props;
    const { error } = this.state;
    if (error && !renderFallback) return null;
    return (
      <React.Fragment>
        {!error && children}
        {error && renderFallback(error)}
      </React.Fragment>
    );
  }
}

ErrorCatch.defaultProps = {};

ErrorCatch.propTypes = {
  children: PropTypes.any,
  renderFallback: PropTypes.func
};

export default ErrorCatch;
