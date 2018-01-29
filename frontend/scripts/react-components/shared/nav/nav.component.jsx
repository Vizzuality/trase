import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import throttle from 'lodash/throttle';
import NavLinksList from 'react-components/shared/nav-links-list.component';

class Nav extends React.PureComponent {
  static getDownloadPdfLink() {
    const pageTitle = encodeURIComponent(document.getElementsByTagName('title')[0].innerText);
    const currentUrlBase = NODE_ENV_DEV
      ? document.location.href.replace('localhost:8081', 'staging.trase.earth')
      : document.location.href;
    const currentUrl = encodeURIComponent(`${currentUrlBase}&print=true`);
    return `${PDF_DOWNLOAD_URL}?filename=${pageTitle}&url=${currentUrl}`;
  }

  constructor(props) {
    super(props);
    this.state = {
      backgroundVisible: false
    };

    this.setBackground = throttle(this.setBackground.bind(this), 300);
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

  render() {
    const { className, printable, links, showLogo } = this.props;
    const { backgroundVisible } = this.state;
    const decoratedLinks = showLogo && [
      {
        name: 'Home',
        page: 'home',
        linkClassName: 'main-nav-link -logo',
        linkActiveClassName: 'main-nav-link -logo',
        children: <img src="/images/logos/logo-trase-nav.png" alt="trase" />
      },
      ...links
    ];
    return (
      <div className={cx('c-nav', { '-has-background': backgroundVisible }, className)}>
        <div className="row align-justify">
          <div className="column medium-8">
            <NavLinksList
              links={decoratedLinks || links}
              listClassName="main-nav-item-list"
              itemClassName="main-nav-item"
              linkClassName="main-nav-link"
              linkActiveClassName="main-nav-link -active"
            />
          </div>
          <div className="column medium-2">
            {printable &&
              <ul className="main-nav-item-list">
                <li className="main-nav-item">
                  <a href={Nav.getDownloadPdfLink()} target="_blank" rel="noopener noreferrer">
                    <svg className="icon icon-download-pdf">
                      <use xlinkHref="#icon-download-pdf" />
                    </svg>
                  </a>
                </li>
              </ul>
            }
          </div>
        </div>
      </div>
    );
  }
}

Nav.propTypes = {
  className: PropTypes.string,
  pageOffset: PropTypes.number,
  printable: PropTypes.bool,
  links: PropTypes.array,
  showLogo: PropTypes.bool
};

Nav.defaultProps = {
  pageOffset: 0
};

export default Nav;
