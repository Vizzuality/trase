import React from 'react';
import PropTypes from 'prop-types';
import throttle from 'lodash/throttle';
import { Transition } from 'react-transition-group';
import NavLinks from 'react-components/nav/nav-links.component';

class SidebarNav extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      open: false
    };

    this.onToggleNav = throttle(this.onToggleNav.bind(this), 550);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.open !== this.state.open) {
      const body = document.querySelector('body');
      if (this.state.open) {
        body.classList.add('-overflow-hidden');
      } else {
        body.classList.remove('-overflow-hidden');
      }
    }
  }

  onToggleNav() {
    this.setState(state => ({ open: !state.open }));
  }

  render() {
    const { links } = this.props;
    const { open } = this.state;
    const icon = open ? 'icon-close' : 'icon-menu';
    const navLinkProps = { onClick: open && this.onToggleNav };
    return (
      <Transition in={open} timeout={300}>
        {transition => (
          <React.Fragment>
            <div className={`c-sidebar-nav -${transition}`}>
              <ul className="nav-sidebar-link-list">
                <NavLinks
                  links={links}
                  itemClassName="nav-sidebar-link-list-item"
                  linkClassName="subtitle -gray"
                  linkActiveClassName="-pink"
                  navLinkProps={navLinkProps}
                />
              </ul>
            </div>
            <button className={`sidebar-nav-toggle -${transition}`} onClick={this.onToggleNav}>
              <svg className={`icon ${icon}`}>
                <use xlinkHref={`#${icon}`} />
              </svg>
            </button>
          </React.Fragment>
        )}
      </Transition>
    );
  }
}

SidebarNav.propTypes = {
  links: PropTypes.array
};

export default SidebarNav;
