import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import ContextSelector from 'react-components/shared/context-selector/context-selector.container';
import NavLinksList from 'react-components/nav/nav-links-list.component';
import YearsSelector from 'react-components/nav/filters-nav/years-selector/years-selector.component';

class FiltersNav extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      menuOpen: false
    };
    this.toggleMenu = this.toggleMenu.bind(this);
    this.renderMenuOpened = this.renderMenuOpened.bind(this);
    this.renderMenuClosed = this.renderMenuClosed.bind(this);
  }

  toggleMenu() {
    this.setState(state => ({ menuOpen: !state.menuOpen }));
  }

  renderMenuOpened() {
    const { links } = this.props;
    return (
      <React.Fragment>
        <NavLinksList
          links={links}
          listClassName="top-nav-item-list"
          itemClassName="top-nav-item"
          linkClassName="top-nav-link"
          linkActiveClassName="top-nav-link -active"
        />
      </React.Fragment>
    );
  }

  renderMenuClosed() {
    const { children } = this.props;
    return (
      <React.Fragment>
        <div className="filters-nav-left-section">
          <ContextSelector />
          <YearsSelector />
        </div>
        <div className="filters-nav-right-section">{children}</div>
      </React.Fragment>
    );
  }

  render() {
    const { menuOpen } = this.state;
    return (
      <div className="c-filters-nav">
        <div className="filters-nav-item">
          <button className={cx('c-burger', { open: menuOpen })} onClick={this.toggleMenu}>
            <span className="ingredient" />
            <span className="ingredient" />
            <span className="ingredient" />
          </button>
        </div>
        {menuOpen ? this.renderMenuOpened() : this.renderMenuClosed()}
      </div>
    );
  }
}

FiltersNav.propTypes = {
  children: PropTypes.element,
  links: PropTypes.array
};

export default FiltersNav;
