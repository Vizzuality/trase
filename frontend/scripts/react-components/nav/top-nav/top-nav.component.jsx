import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import throttle from 'lodash/throttle';
import { NavLink } from 'redux-first-router-link';
import NavLinks from 'react-components/nav/nav-links.component';
import LocaleSelector from 'react-components/nav/locale-selector/locale-selector.container';
import Search from 'react-components/shared/search.container';
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
            <ul className="top-nav-item-list">
              <NavLinks
                links={allLinks}
                itemClassName="top-nav-item"
                linkClassName="top-nav-link"
                linkActiveClassName="top-nav-link -active"
                navLinkProps={this.navLinkProps}
              />
            </ul>
          </div>
        </div>
        <div className="column medium-2">
          <div className="top-nav-item-list-container -flex-end">
            <ul className="top-nav-item-list">
              <li className="top-nav-item">
                <LocaleSelector />
              </li>
              <li className="top-nav-item">
                <Search />
              </li>
              {printable && (
                <li className="top-nav-item">
                  <DownloadPdfLink />
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    );
  }

  renderMobileMenu() {
    const { links, showLogo } = this.props;
    const { menuOpen } = this.state;

    const toggleBtnIcon = menuOpen ? 'close' : 'menu';

    return (
      <div className="row show-for-small">
        <div className="top-nav-bar column small-12">
          <ul className="top-nav-item-list">
            <li className="top-nav-item -no-margin">
              <NavLink
                exact
                strict
                className={cx('top-nav-link', '-logo', { '-hide-when-on-top': !showLogo })}
                to={{ type: 'home' }}
              >
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
          <div className="top-nav-collapse column small-12">
            <ul className="top-nav-item-list-collapse">
              <NavLinks
                links={links}
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
      <div className={cx('c-nav', { '-has-background': backgroundVisible || menuOpen }, className)}>
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
