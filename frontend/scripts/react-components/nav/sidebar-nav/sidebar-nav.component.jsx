import React from 'react';
import PropTypes from 'prop-types';

import NavLinks from 'react-components/nav/nav-links.component';

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

    if (activeLink.scrollIntoView) {
      sidebarList.scrollLeft = 0;
      activeLink.scrollIntoView(false);
    }
  }

  render() {
    const { links } = this.props;

    return (
      <div className="c-sidebar-nav">
        <ul className="nav-sidebar-link-list">
          <NavLinks
            links={links}
            itemClassName="nav-sidebar-link-list-item"
            linkClassName="subtitle -gray"
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
