import React from 'react';
import PropTypes from 'prop-types';
import Text from 'react-components/shared/text/text.component';
import './accordion.scss';

class Accordion extends React.PureComponent {
  state = {
    isOpen: this.props.defaultValue || false
  };

  toggleOpen = () => {
    const { isOpen } = this.state;
    const { onToggle } = this.props;
    if (onToggle) onToggle();
    this.setState({ isOpen: !isOpen });
  };

  render() {
    const { title, children } = this.props;
    const { isOpen } = this.state;
    return (
      <div className="c-accordion">
        <button onClick={this.toggleOpen} className="button">
          <Text as="span" size="rg">
            {title}
          </Text>
          <Text as="span" size="lg" color="pink" className="seeMore">
            {isOpen ? '-' : '+'}
          </Text>
        </button>
        {isOpen ? <div className="content">{children}</div> : null}
      </div>
    );
  }
}

Accordion.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node,
  defaultValue: PropTypes.bool,
  onToggle: PropTypes.func
};

export default Accordion;
