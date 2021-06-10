import React, { Suspense } from 'react';
import { Transition } from 'react-spring/renderprops';
import PropTypes from 'prop-types';
import cx from 'classnames';
import throttle from 'lodash/throttle';
import { NavLink } from 'redux-first-router-link';
import NavLinks from 'react-components/nav/nav-links.component';
import Hamburger from 'react-components/nav/hamburger';
import LocaleSelector from 'react-components/nav/locale-selector/locale-selector.container';
import Search from 'react-components/nav/global-search/global-search.container';
import ToolSearch from 'react-components/tool/tool-search/tool-search.container';
import Img from 'react-components/shared/img';
import { BREAKPOINTS } from 'constants';
import ResizeListener from 'react-components/shared/resize-listener.component';

import 'scripts/react-components/nav/top-nav/top-nav.scss';

import ToolsInsights from './tabs/tools-insights.component';

const DownloadPdfLink = React.lazy(() => import('./download-pdf-link.component'));

class TopNav extends React.PureComponent {
  state = {
    backgroundVisible: false,
    menuOpen: false
  };

  navLinkProps = {
    exact: false,
    strict: false
  };

  mobileMenuRef = React.createRef(null);

  componentDidMount() {
    // window.addEventListener('click', this.handleClickOutside);
    window.addEventListener('scroll', this.setBackground, { passive: true });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.page !== this.props.page && this.state.menuOpen) {
      this.handleToggleClick();
    }
  }

  componentWillUnmount() {
    this.setBackground.cancel();
    window.removeEventListener('click', this.handleClickOutside);
    window.removeEventListener('scroll', this.setBackground);
  }

  setBackground = throttle(() => {
    const { pageOffset } = this.props;
    const { backgroundVisible } = this.state;
    const hasOffset = typeof pageOffset !== 'undefined';
    if (hasOffset && window.pageYOffset > pageOffset && !backgroundVisible) {
      this.setState({ backgroundVisible: true });
    } else if (hasOffset && window.pageYOffset <= pageOffset && backgroundVisible) {
      this.setState({ backgroundVisible: false });
    }
  }, 300);

  handleClickOutside = e => {
    const { target } = e;
    if (!this.mobileMenuRef.current.contains(target) && this.state.menuOpen) {
      this.handleToggleClick();
    }
  };

  handleToggleClick = () => this.setState(state => ({ menuOpen: !state.menuOpen }));

  renderPopoverMenu() {
    const { menuOpen } = this.state;
    return (
      <div className="nav-tabs-container">
        <Transition
          items={menuOpen}
          from={{ opacity: 0, transform: 'translateY(-110%)' }}
          leave={{ opacity: 0, transform: 'translateY(-110%)' }}
          enter={{ opacity: 1, transform: 'translateY(0%)' }}
        >
          {show =>
            show &&
            (props => (
              <div style={props}>
                <ToolsInsights />
              </div>
            ))
          }
        </Transition>

        <Transition
          items={menuOpen}
          from={{ opacity: 0 }}
          leave={{ opacity: 0 }}
          enter={{ opacity: 1 }}
        >
          {show =>
            show &&
            (props => (
              <div
                role="button"
                tabIndex={0}
                style={props}
                onClick={() => this.setState({ menuOpen: false })}
                className="-backdrop"
              />
            ))
          }
        </Transition>
      </div>
    );
  }

  renderMenu() {
    const { links, printable, showLogo, page } = this.props;
    const { menuOpen } = this.state;
    const allLinks = [];

    if (showLogo && !ENABLE_TOOL_PANEL) {
      allLinks.push({
        name: 'Home',
        page: 'home',
        linkClassName: 'top-nav-link -logo',
        linkActiveClassName: 'top-nav-link -logo',
        children: <Img src="/images/logos/logo-trase-nav.png" alt="trase" />
      });
    }

    allLinks.push(...links);

    const SearchLabel = desktop => (desktop ? null : <span className="search-text">SEARCH</span>);

    return (
      <ResizeListener>
        {({ windowWidth }) => {
          const isDesktop = windowWidth >= BREAKPOINTS.laptop;
          return (
            <div className="nav-menu">
              <div className="first-row">
                <div className="left-section">
                  <Hamburger onClick={this.handleToggleClick} isOpen={menuOpen} />
                  <NavLink exact strict to={{ type: 'home' }} className="top-nav-logo">
                    <Img
                      loading="lazy"
                      className="logo-image"
                      src="/images/logos/trase-logo.svg"
                      alt="trase logo"
                    />
                  </NavLink>
                </div>
                <div className="right-section">
                  {isDesktop && !menuOpen && (
                    <ul className="nav-menu-main-navigation">
                      <NavLinks
                        links={allLinks}
                        itemClassName="top-nav-item"
                        linkClassName="top-nav-link"
                        linkActiveClassName="top-nav-link -active"
                        navLinkProps={this.navLinkProps}
                      />
                    </ul>
                  )}
                  <ul className="top-nav-item-list">
                    <li className="top-nav-item search-container">
                      <span className="search-icon">
                        {page === 'tool' ? (
                          <ToolSearch labelComponent={isDesktop ? SearchLabel : null} />
                        ) : (
                          <Search
                            className="top-nav-search"
                            labelComponent={isDesktop ? SearchLabel : null}
                          />
                        )}
                      </span>
                    </li>
                    <li className="top-nav-item">
                      <LocaleSelector />
                    </li>
                    {printable && (
                      <li className="top-nav-item">
                        <Suspense fallback={null}>
                          <DownloadPdfLink />
                        </Suspense>
                      </li>
                    )}
                  </ul>
                </div>
              </div>
              {!isDesktop && (
                <div className="second-row">
                  <ul className="nav-menu-main-navigation">
                    <NavLinks
                      links={allLinks}
                      itemClassName="top-nav-item"
                      linkClassName="top-nav-link"
                      linkActiveClassName="top-nav-link -active"
                      navLinkProps={this.navLinkProps}
                    />
                  </ul>
                </div>
              )}
            </div>
          );
        }}
      </ResizeListener>
    );
  }

  render() {
    const { className, page } = this.props;
    const { backgroundVisible, menuOpen } = this.state;
    const YELLOW_PAGES = ['profiles', 'profile', 'data'];
    return (
      <div
        className={cx(
          'c-nav',
          {
            '-has-background': backgroundVisible || menuOpen,
            '-yellow-background': YELLOW_PAGES.includes(page) && !backgroundVisible && !menuOpen,
            '-no-shadow': className === '-egg-shell'
          },
          className
        )}
      >
        {this.renderMenu()}
        {this.renderPopoverMenu()}
      </div>
    );
  }
}

TopNav.propTypes = {
  page: PropTypes.string,
  links: PropTypes.array,
  showLogo: PropTypes.bool,
  printable: PropTypes.bool,
  className: PropTypes.string,
  pageOffset: PropTypes.number
};

TopNav.defaultProps = {
  pageOffset: 0
};

export default TopNav;
