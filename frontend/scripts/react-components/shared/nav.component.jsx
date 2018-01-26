import React from 'react';
// import cx from 'classnames';
import { NavLink } from 'redux-first-router-link';

const links = [
  {
    name: 'Supply Chain',
    page: 'tool'
  },
  {
    name: 'Map',
    page: 'tool'
  },
  {
    name: 'Profiles',
    page: 'profiles'
  },
  {
    name: 'Download',
    page: 'data'
  },
  {
    name: 'About',
    page: 'about'
  }
];

const Footer = () => (
  <div className="row">
    <div className="column medium-7">
      {
        links.map(link => (
          <NavLink key={link.name}>
            {link.name}
          </NavLink>
        ))
      }
    </div>
    <div className="column medium-2 medium-offset-2">
      actions
    </div>
  </div>
);

export default Footer;
