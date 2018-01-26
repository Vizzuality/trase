import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import throttle from 'lodash/throttle';
import NavLinksList from 'react-components/shared/nav-links-list.component';

const links = [
  {
    name: 'Supply Chain',
    page: 'tool'
  },
  {
    name: 'Map',
    page: 'tool'
  },
  {
    name: 'Profiles',
    page: 'profiles'
  },
  {
    name: 'Download',
    page: 'data'
  },
  {
    name: 'About',
    page: 'about'
  }
];

class Nav extends React.PureComponent {
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
    const { className } = this.props;
    const { backgroundVisible } = this.state;
    return (
      <div className={cx('c-nav', { '-has-background': backgroundVisible }, className)}>
        <div className="row align-justify">
          <div className="column medium-7">
            <NavLinksList
              links={links}
              listClassName="nav-item-list"
              itemClassName="nav-item"
              linkClassName="nav-link"
              linkActiveClassName="nav-link -active"
            />
          </div>
          <div className="column medium-2">
            actions
          </div>
        </div>
      </div>
    );
  }
}

Nav.propTypes = {
  pageOffset: PropTypes.number,
  className: PropTypes.string
};

Nav.defaultProps = {
  pageOffset: 0
};

export default Nav;
