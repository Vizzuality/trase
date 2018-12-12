import React from 'react';
import PropTypes from 'prop-types';
import NavLinks from 'react-components/nav/nav-links.component';

import 'scripts/react-components/nav/sidebar-nav/sidebar-nav.scss';

class SidebarNav extends React.PureComponent {
  componentDidMount() {
    this.scrollActiveLinkIntoView();
  }

  componentDidUpdate() {
    this.scrollActiveLinkIntoView();
  }

  scrollActiveLinkIntoView() {
    const activeLink = document.querySelector('.c-sidebar-nav .active-link');
    const sidebarList = document.querySelector('.nav-sidebar-link-list');

    if (!activeLink || !sidebarList) return;

    const activeLinkRect = activeLink.getBoundingClientRect();

    sidebarList.scrollLeft += activeLinkRect.x + activeLinkRect.width / 2 - window.innerWidth / 2;
  }

  render() {
    const { links } = this.props;

    return (
      <div className="c-sidebar-nav">
        <ul className="nav-sidebar-link-list">
          <NavLinks
            links={links}
            itemClassName="nav-sidebar-link-list-item"
            linkClassName="nav-sidebar-link-list-item-link"
            linkActiveClassName="-pink active-link"
          />
        </ul>
      </div>
    );
  }
}

SidebarNav.propTypes = {
  links: PropTypes.array
};

export default SidebarNav;
