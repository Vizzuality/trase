import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'redux-first-router-link';

function mapLinksToRouter(link) {
  return typeof link.page === 'string' && link.external !== true
    ? { ...link, page: { type: link.page, payload: {} } }
    : link;
}

function isActive(match, location, link) {
  const route = location.routesMap[location.type];
  const isParent = route.parent && link.page.type === route.parent;

  return (
    (location.type === link.page.type || isParent) &&
    (link.page.payload && link.page.payload.section) ===
      (location.payload && location.payload.section)
  );
}

const NavLinks = props => {
  const {
    links,
    itemClassName,
    linkClassName,
    linkActiveClassName,
    navLinkProps,
    isActiveLink
  } = props;

  console.log(links);
  const checkLink = isActiveLink || isActive;
  return (
    <React.Fragment>
      {links.map(mapLinksToRouter).map(link => (
        <li key={link.name} className={link.itemClassName || itemClassName}>
          <NavLink
            exact
            strict
            to={link.page}
            className={link.linkClassName || linkClassName}
            activeClassName={link.linkActiveClassName || linkActiveClassName}
            isActive={(...params) => checkLink(...params, link)}
            {...navLinkProps}
          >
            {link.children || link.name}
          </NavLink>
        </li>
      ))}
    </React.Fragment>
  );
};

NavLinks.propTypes = {
  links: PropTypes.array,
  itemClassName: PropTypes.string,
  linkClassName: PropTypes.string,
  linkActiveClassName: PropTypes.string,
  navLinkProps: PropTypes.object,
  isActiveLink: PropTypes.func
};

export default NavLinks;
