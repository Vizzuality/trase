import React from 'react';
import PropTypes from 'prop-types';

import './accordion.scss';

class Accordion extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      isOpen: false
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
  children: PropTypes.node
};

export default Accordion;
