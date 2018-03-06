import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import throttle from 'lodash/throttle';
import { NavLink } from 'redux-first-router-link';
import NavLinksList from 'react-components/nav/nav-links-list.component';
import NavLinks from 'react-components/nav/nav-links.component';
import LocaleSelector from 'react-components/nav/locale-selector/locale-selector.container';
import DownloadPdfLink from './download-pdf-link.component';

class TopNav extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      backgroundVisible: false,
      menuOpen: false
    };
    this.navLinkProps = {
      exact: false,
      strict: false,
      isActive: null
    };
    this.setBackground = throttle(this.setBackground.bind(this), 300);
    this.handleToggleClick = this.handleToggleClick.bind(this);
    window.addEventListener('scroll', this.setBackground);
  }

  componentWillUnmount() {
    this.setBackground.cancel();
    window.removeEventListener('scroll', this.setBackground);
  }

  setBackground() {
    const { pageOffset } = this.props;
    const { backgroundVisible } = this.state;
    const hasOffset = typeof pageOffset !== 'undefined';
    if (hasOffset && window.pageYOffset > pageOffset && !backgroundVisible) {
      this.setState({ backgroundVisible: true });
    } else if (hasOffset && window.pageYOffset <= pageOffset && backgroundVisible) {
      this.setState({ backgroundVisible: false });
    }
  }

  handleToggleClick() {
    this.setState(state => ({ menuOpen: !state.menuOpen }));
  }

  renderDesktopMenu() {
    const { links, printable, showLogo } = this.props;
    const allLinks = [];

    if (showLogo) {
      allLinks.push({
        name: 'Home',
        page: 'home',
        linkClassName: 'top-nav-link -logo',
        linkActiveClassName: 'top-nav-link -logo',
        children: <img src="/images/logos/logo-trase-nav.png" alt="trase" />
      });
    }

    allLinks.push(...links);

    return (
      <div className="top-nav-bar row align-justify hide-for-small">
        <div className="column medium-8">
          <div className="top-nav-item-list-container">
            <NavLinksList
              links={allLinks}
              listClassName="top-nav-item-list"
              itemClassName="top-nav-item"
              linkClassName="top-nav-link"
              linkActiveClassName="top-nav-link -active"
              navLinkProps={this.navLinkProps}
            />
          </div>
        </div>
        <div className="column medium-2">
          <ul className="top-nav-item-list">
            <li className="top-nav-item">
              <LocaleSelector />
            </li>
            {printable && (
              <li className="top-nav-item">
                <DownloadPdfLink />
              </li>
            )}
          </ul>
        </div>
      </div>
    );
  }

  renderMobileMenu() {
    const { links, printable } = this.props;
    const { menuOpen } = this.state;

    const toggleBtnIcon = menuOpen ? 'close' : 'menu';

    return (
      <div className="row show-for-small">
        <div className="top-nav-bar column small-12">
          <ul className="top-nav-item-list">
            <li className="top-nav-item -no-margin">
              <NavLink exact strict className="top-nav-link -logo" to={{ type: 'home' }}>
                <img src="/images/logos/logo-trase-nav.png" alt="trase" />
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
          <div className="column small-12">
            <div className="top-nav-collapse">
              <ul className="top-nav-item-list-horizontal">
                <NavLinks
                  links={links}
                  itemClassName="top-nav-item-horizontal"
                  linkClassName="top-nav-link-horizontal"
                  linkActiveClassName="top-nav-link-horizontal -active"
                  navLinkProps={this.navLinkProps}
                />
                <li className="top-nav-item-horizontal">
                  <LocaleSelector />
                </li>
              </ul>
              {printable && <DownloadPdfLink className="download-pdf-link" />}
            </div>
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
          { '-has-background': backgroundVisible || menuOpen, '-open': menuOpen },
          className
        )}
      >
        {this.renderDesktopMenu()}
        {this.renderMobileMenu()}
      </div>
    );
  }
}

TopNav.propTypes = {
  className: PropTypes.string,
  pageOffset: PropTypes.number,
  printable: PropTypes.bool,
  links: PropTypes.array,
  showLogo: PropTypes.bool
};

TopNav.defaultProps = {
  pageOffset: 0
};

export default TopNav;
