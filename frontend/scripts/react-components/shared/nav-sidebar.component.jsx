import React from 'react';
import PropTypes from 'prop-types';

const NavSidebar = props => (
  <div className="c-nav-sidebar">
    {props.children}
  </div>
);

NavSidebar.propTypes = {
  children: PropTypes.element
};

export default NavSidebar;
