import React from 'react';
import { Transition } from 'react-spring/renderprops';
import PropTypes from 'prop-types';
import cx from 'classnames';
import throttle from 'lodash/throttle';
import { NavLink } from 'redux-first-router-link';
import NavLinks from 'react-components/nav/nav-links.component';
import LocaleSelector from 'react-components/nav/locale-selector/locale-selector.container';
import Search from 'react-components/nav/global-search/global-search.container';
import ToolSearch from 'react-components/tool/tool-search/tool-search.container';
import Img from 'react-components/shared/img';

import 'scripts/react-components/nav/top-nav-redesign/top-nav-redesign.scss';

import ToolsInsights from './tabs/tools-insights.component';

const DownloadPdfLink = React.lazy(() => import('./download-pdf-link.component'));

class TopNavRedesign extends React.PureComponent {
  state = {
    backgroundVisible: false,
    menuOpen: false
  };

  navLinkProps = {
    exact: false,
    strict: false,
    isActive: null
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

  renderDesktopMenu() {
    const { links, printable, showLogo, className, page } = this.props;
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

    return (
      <div className="nav-menu -desktop-menu">
        <div className="left-section">
          <button className="top-nav-toggle-btn" onClick={this.handleToggleClick}>
            <svg className={`icon icon-${menuOpen ? 'close' : 'menu'}`}>
              <use xlinkHref={`#icon-${menuOpen ? 'close' : 'menu'}`} />
            </svg>
          </button>
          <NavLink exact strict to={{ type: 'home' }} className={cx('top-nav-logo')}>
            <Img
              loading="lazy"
              className="logo-image"
              src="/images/logos/new-logo-trase-red.svg"
              alt="trase"
            />
          </NavLink>
        </div>
      </div>
    );
  }

  renderMobileMenu() {
    const { links, showLogo } = this.props;
    const { menuOpen } = this.state;

    const toggleBtnIcon = menuOpen ? 'close' : 'menu';

    const allLinks = [];

    allLinks.push(...links);

    return (
      <div className="row -mobile-menu" ref={this.mobileMenuRef}>
        <div className="top-nav-bar column small-12">
          <ul className="top-nav-item-list">
            <li className="top-nav-item -no-margin">
              <NavLink
                exact
                strict
                to={{ type: 'home' }}
                className={cx('top-nav-link', '-logo', { '-hide-when-on-top': !showLogo })}
              >
                <Img src="/images/logos/logo-trase-nav.png" alt="trase" />
              </NavLink>
            </li>
            <li className="top-nav-item -no-margin">
              <button className="top-nav-toggle-btn" onClick={this.handleToggleClick}>
                <svg className={`icon icon-${toggleBtnIcon}`}>
                  <use xlinkHref={`#icon-${toggleBtnIcon}`} />
                </svg>
              </button>
            </li>
          </ul>
        </div>
        {menuOpen && (
          <div className="top-nav-collapse column small-12">
            <ul className="top-nav-item-list-collapse">
              <NavLinks
                links={allLinks}
                itemClassName="top-nav-item-collapse"
                linkClassName="top-nav-link-collapse"
                linkActiveClassName="top-nav-link-collapse -active"
                navLinkProps={this.navLinkProps}
              />
              <li className="top-nav-item-collapse">
                <LocaleSelector />
              </li>
            </ul>
          </div>
        )}
      </div>
    );
  }

  render() {
    const { className } = this.props;
    const { backgroundVisible, menuOpen } = this.state;

    return (
      <div
        className={cx(
          'c-nav',
          {
            '-has-background': backgroundVisible || menuOpen,
            '-no-shadow': className === '-egg-shell'
          },
          className
        )}
      >
        {this.renderDesktopMenu()}
        {this.renderPopoverMenu()}
      </div>
    );
  }
}

TopNavRedesign.propTypes = {
  page: PropTypes.string,
  links: PropTypes.array,
  showLogo: PropTypes.bool,
  printable: PropTypes.bool,
  className: PropTypes.string,
  pageOffset: PropTypes.number
};

TopNavRedesign.defaultProps = {
  pageOffset: 0
};

export default TopNavRedesign;
