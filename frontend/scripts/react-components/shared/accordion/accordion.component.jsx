import React from 'react';
import PropTypes from 'prop-types';

import './accordion.scss';

class Accordion extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: props.initialOpen || false
    };
  }

  toggleOpen = () => {
    const { isOpen } = this.state;
    this.setState({ isOpen: !isOpen });
  };

  render() {
    const { title, children } = this.props;
    const { isOpen } = this.state;
    return (
      <div className="c-accordion">
        <button onClick={this.toggleOpen}>
          <span className="title">{title}</span>
          <span className="seeMore">{isOpen ? '-' : '+'}</span>
        </button>
        {isOpen ? <div className="content">{children}</div> : null}
      </div>
    );
  }
}

Accordion.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node,
  initialOpen: PropTypes.bool
};

export default Accordion;
