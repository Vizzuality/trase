import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'redux-first-router-link';

function mapLinksToRouter(link) {
  return typeof link.page === 'string' && !link.external
    ? { ...link, page: { type: link.page, payload: {} } }
    : link;
}

function isActive(match, location, link) {
  const route = location.routesMap[location.type];
  const hasParent = route.parent && link.page.type === route.parent;
  const noSectionButHasParent = hasParent && !link.page?.payload?.section;
  const noSectionButIsDefault =
    !location.payload?.section && link.page?.payload?.section === route?.default;

  return (
    noSectionButHasParent ||
    (location.type === link.page.type &&
      (link.page?.payload?.section === location.payload?.section || noSectionButIsDefault))
  );
}

const NavLinks = props => {
  const { links, itemClassName, linkClassName, linkActiveClassName, navLinkProps } = props;
  return (
    <React.Fragment>
      {links.map(mapLinksToRouter).map(link => (
        <li key={link.name} className={link.itemClassName || itemClassName}>
          {link.external && (
            <a
              href={link.page}
              className={link.linkClassName || linkClassName}
              target={link.target || '_blank'}
              rel="noopener noreferrer"
            >
              {link.children || link.name}
              {link.subtitle && <span className={link.subtitleClassName}>{link.subtitle}</span>}
            </a>
          )}
          {!link.external && (
            <NavLink
              exact
              strict
              to={link.page}
              className={link.linkClassName || linkClassName}
              activeClassName={link.linkActiveClassName || linkActiveClassName}
              isActive={(...params) => isActive(...params, link)}
              {...navLinkProps}
            >
              {link.children || link.name}
            </NavLink>
          )}
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
  navLinkProps: PropTypes.object
};

export default NavLinks;
