import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'redux-first-router-link';

function mapLinksToRouter(link) {
  return typeof link.page === 'string' ? { ...link, page: { type: link.page, payload: {} } } : link;
}

function isActive(match, location, link) {
  return location.type === link.page.type && link.page.payload.section === location.payload.section;
}

const NavLinksList = props => {
  const { links, listClassName, itemClassName, linkClassName, linkActiveClassName } = props;

  return (
    <ul className={listClassName}>
      {links.map(mapLinksToRouter).map(link => (
        <li key={link.name} className={link.itemClassName || itemClassName}>
          <NavLink
            exact
            strict
            to={link.page}
            className={link.linkClassName || linkClassName}
            activeClassName={link.linkActiveClassName || linkActiveClassName}
            isActive={(...params) => isActive(...params, link)}
          >
            {link.children || link.name}
          </NavLink>
        </li>
      ))}
    </ul>
  );
};

NavLinksList.propTypes = {
  links: PropTypes.array,
  listClassName: PropTypes.string,
  itemClassName: PropTypes.string,
  linkClassName: PropTypes.string,
  linkActiveClassName: PropTypes.string
};

export default NavLinksList;
