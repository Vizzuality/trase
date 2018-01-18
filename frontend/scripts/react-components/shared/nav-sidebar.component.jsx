import React from 'react';
import PropTypes from 'prop-types';
import NavLink from 'redux-first-router-link';

const NavSidebar = (props) => {
  const { links } = props;
  return (
    <div className="c-nav-sidebar">
      <ul className="nav-sidebar-link-list">
        {
          links.map(link => (
            <li key={link.page} className="nav-sidebar-link-list-item">
              <NavLink
                className="subtitle -gray"
                to={{ type: link.page }}
              >
                {link.name}
              </NavLink>
            </li>
          ))
        }
      </ul>
    </div>
  );
};

NavSidebar.propTypes = {
  links: PropTypes.array
};

export default NavSidebar;
