import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

class Portal extends React.PureComponent {
  constructor(props) {
    super(props);
    this.root = document.getElementById('app-portal-container');
    this.el = document.createElement(props.element);
  }

  componentDidMount() {
    this.root.appendChild(this.el);
  }

  componentWillUnmount() {
    this.root.removeChild(this.el);
  }

  render() {
    const { children } = this.props;
    return ReactDOM.createPortal(children, this.root);
  }
}

Portal.propTypes = {
  element: PropTypes.string,
  children: PropTypes.node
};

Portal.defaultProps = {
  element: 'div'
};

export default Portal;

