/* eslint-disable no-return-assign */
import React, { Component } from 'react';
import findParent from 'find-parent';
import PropTypes from 'prop-types';

class FiltersDropdown extends Component {
  constructor(props) {
    super(props);
    this.handleBound = this.handle.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const currentlyDisplaysChildren = this.props.currentDropdown === this.props.id;
    const willDisplayChildren = nextProps.currentDropdown === nextProps.id;

    if (!currentlyDisplaysChildren && willDisplayChildren) {
      document.addEventListener('click', this.handleBound, true);
    } else if (currentlyDisplaysChildren && !willDisplayChildren) {
      document.removeEventListener('click', this.handleBound, true);
    }
  }

  handle(e) {
    const isInside =
      this.container.contains(e.target) ||
      findParent.byClassName(e.target, 'js-dropdown') !== undefined;

    if (isInside === false) {
      this.props.onClickOutside(null);
    }
  }

  render() {
    const { id, currentDropdown } = this.props;

    const children = currentDropdown !== id ? null : this.props.children;

    return (
      <div id={id} ref={ref => (this.container = ref)} className="dropdown-container">
        {children}
      </div>
    );
  }
}

FiltersDropdown.propTypes = {
  children: PropTypes.element,
  id: PropTypes.string,
  currentDropdown: PropTypes.string,
  onClickOutside: PropTypes.func
};

export default FiltersDropdown;
