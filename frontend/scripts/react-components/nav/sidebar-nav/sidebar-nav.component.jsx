import React from 'react';
import PropTypes from 'prop-types';

import NavLinks from 'react-components/nav/nav-links.component';

class SidebarNav extends React.PureComponent {
  render() {
    const { links } = this.props;

    return (
      <div className="c-sidebar-nav">
        <ul className="nav-sidebar-link-list">
          <NavLinks
            links={links}
            itemClassName="nav-sidebar-link-list-item"
            linkClassName="subtitle -gray"
            linkActiveClassName="-pink"
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
