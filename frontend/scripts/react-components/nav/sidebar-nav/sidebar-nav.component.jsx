import React from 'react';
import PropTypes from 'prop-types';
import NavLinksList from 'react-components/nav/nav-links-list.component';

class SidebarNav extends React.PureComponent {
  render() {
    const { links } = this.props;

    return (
      <div className="c-sidebar-nav">
        <NavLinksList
          links={links}
          listClassName="nav-sidebar-link-list"
          itemClassName="nav-sidebar-link-list-item"
          linkClassName="subtitle -gray"
          linkActiveClassName="-pink"
        />
      </div>
    );
  }
}

SidebarNav.propTypes = {
  links: PropTypes.array
};

export default SidebarNav;
