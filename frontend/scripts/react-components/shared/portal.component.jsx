import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

class Portal extends React.PureComponent {
  constructor(props) {
    super(props);
    this.root = document.getElementById('app-portal-container');
    this.el = document.createElement('aside');
  }

  componentDidMount() {
    this.root.appendChild(this.el);
  }

  componentWillUnmount() {
    this.root.removeChild(this.el);
  }

  render() {
    const { open, children } = this.props;
    return open ? ReactDOM.createPortal(children, this.el) : null;
  }
}

Portal.propTypes = {
  open: PropTypes.bool.isRequired,
  children: PropTypes.node
};

export default Portal;

