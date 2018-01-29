import React from 'react';
import PropTypes from 'prop-types';
import throttle from 'lodash/throttle';
import { NavLink } from 'redux-first-router-link';
import { Transition } from 'react-transition-group';

class NavSidebar extends React.PureComponent {
  static mapLinksToRouter(link) {
    return (
      typeof link.page === 'string'
        ? ({ ...link, page: { type: link.page, payload: {} } })
        : link
    );
  }

  static isActive(match, location, link) {
    return (
      location.type === link.page.type &&
      link.page.payload.section === location.payload.section
    );
  }

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
    return (
      <Transition in={open} timeout={300}>
        {
          transition => (
            <React.Fragment>
              <div className={`c-nav-sidebar -${transition}`}>
                <ul className="nav-sidebar-link-list">
                  {
                    links.map(NavSidebar.mapLinksToRouter)
                      .map(link => (
                        <li key={link.name} className="nav-sidebar-link-list-item">
                          <NavLink
                            exact
                            strict
                            to={link.page}
                            className="subtitle -gray"
                            activeClassName="-pink"
                            isActive={(...params) => NavSidebar.isActive(...params, link)}
                          >
                            {link.name}
                          </NavLink>
                        </li>
                      ))
                  }
                </ul>
              </div>
              <button
                className={`sidebar-nav-toggle -${transition}`}
                onClick={this.onToggleNav}
              >
                <svg className={`icon ${icon}`}>
                  <use xlinkHref={`#${icon}`} />
                </svg >
              </button>
            </React.Fragment>
          )
        }
      </Transition>
    );
  }
}

NavSidebar.propTypes = {
  links: PropTypes.array
};

export default NavSidebar;
