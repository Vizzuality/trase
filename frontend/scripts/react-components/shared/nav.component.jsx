import React from 'react';
// import cx from 'classnames';
import NavLinksList from 'react-components/shared/nav-links-list.component';

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
  <div className="row align-justify">
    <div className="column medium-7">
      <NavLinksList
        links={links}
        listClassName="nav-item-list"
        itemClassName="nav-item"
        linkClassName="nav-link"
        linkActiveClassName="nav-link -active"
      />
    </div>
    <div className="column medium-2">
      actions
    </div>
  </div>
);

export default Footer;
