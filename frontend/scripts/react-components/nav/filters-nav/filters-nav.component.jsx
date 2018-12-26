/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import AdminLevelFilter from 'react-components/nav/filters-nav/admin-level-filter/admin-level-filter.container';
import RecolorBySelector from 'react-components/nav/filters-nav/recolor-by-selector/recolor-by-selector.container';
import ResizeBySelector from 'react-components/nav/filters-nav/resize-by-selector/resize-by-selector.container';
import ViewSelector from 'react-components/nav/filters-nav/view-selector/view-selector.container';
import YearsSelector from 'react-components/nav/filters-nav/years-selector/years-selector.container';
import YearsDropdownSelector from 'react-components/nav/filters-nav/years-dropdown-selector/years-dropdown-selector.container';
import LocaleSelector from 'react-components/nav/locale-selector/locale-selector.container';
import NavLinksList from 'react-components/nav/nav-links.component';
import ContextSelector from 'react-components/shared/context-selector/context-selector.container';
import ToolSearch from 'react-components/tool/tool-search/tool-search.container';
import { NavLink } from 'redux-first-router-link';

import 'scripts/react-components/nav/filters-nav/filters-nav.scss';
import 'scripts/react-components/nav/filters-nav/burger.scss';

const FILTERS = [ContextSelector, YearsSelector, null, RecolorBySelector];

class FiltersNav extends React.PureComponent {
  state = {
    menuOpen: false
  };

  toggleMenu = () => this.setState(state => ({ menuOpen: !state.menuOpen }));

  renderMenuButton = () => {
    const { menuOpen } = this.state;
    const content = menuOpen ? (
      <div className="c-burger open">
        <span className="ingredient" />
        <span className="ingredient" />
        <span className="ingredient" />
      </div>
    ) : (
      <div className="filters-nav-item-logo">
        <img src="/images/logos/logo-trase-small-beta.svg" alt="TRASE" />
      </div>
    );
    return (
      <button className="filters-nav-item -no-padding" onClick={this.toggleMenu} type="button">
        {content}
      </button>
    );
  };

  renderInToolLinks() {
    const { links, openMap, openSankey, isMapVisible } = this.props;
    const [supplyChainLink, mapLink] = links;
    return (
      <ul className="filters-nav-submenu-list">
        <li className="filters-nav-item">
          <NavLink exact strict className="filters-nav-link" to={{ type: 'home' }}>
            home
          </NavLink>
        </li>
        <li className="filters-nav-item">
          <span
            className={cx('filters-nav-link', {
              '-active': !isMapVisible
            })}
            onClick={openSankey}
          >
            {supplyChainLink.name}
          </span>
        </li>
        <li className="filters-nav-item">
          <span
            className={cx('filters-nav-link', {
              '-active': isMapVisible
            })}
            onClick={openMap}
          >
            {mapLink.name}
          </span>
        </li>
      </ul>
    );
  }

  renderMenuOpened = () => {
    const { links, filters } = this.props;
    const restOfLinks = links.slice(2);
    const decoratedLinks = [{ name: 'Home', page: { type: 'home' } }, ...links];
    const navLinks = filters.showToolLinks ? restOfLinks : decoratedLinks;

    return (
      <React.Fragment>
        <div className="filters-nav-left-section">
          {filters.showToolLinks && this.renderInToolLinks()}
          <ul className="filters-nav-submenu-list">
            <NavLinksList
              links={navLinks}
              itemClassName="filters-nav-item"
              linkClassName="filters-nav-link"
              linkActiveClassName="filters-nav-link -active"
            />
          </ul>
        </div>
        <div className="filters-nav-right-section">
          <div className="filters-nav-item">
            <LocaleSelector />
          </div>
          <ToolSearch className="filters-nav-item -no-padding" />
        </div>
      </React.Fragment>
    );
  };

  renderMenuClosed = () => (
    <React.Fragment>
      {this.renderLeftSection()}
      {this.renderRightSection()}
    </React.Fragment>
  );

  renderLeftSection = () => {
    const {
      filters: { left = [] }
    } = this.props;
    return (
      <div className="filters-nav-left-section">
        {left.map(filter =>
          React.createElement(FILTERS[filter.type], {
            className: 'filters-nav-item',
            ...filter.props
          })
        )}
      </div>
    );
  };

  renderRightSection = () => {
    const {
      filters: { right = [], showSearch }
    } = this.props;
    return (
      <div className="filters-nav-left-section">
        {right.map(filter =>
          React.createElement(FILTERS[filter.type], {
            className: 'filters-nav-item',
            ...filter.props
          })
        )}
        {showSearch && <ToolSearch className="filters-nav-item -no-padding" />}
      </div>
    );
  };

  render() {
    const { menuOpen } = this.state;
    return (
      <div className="c-filters-nav">
        {this.renderMenuButton()}
        <div className="filters-nav-section-container">
          {menuOpen ? this.renderMenuOpened() : this.renderMenuClosed()}
        </div>
      </div>
    );
  }
}

FiltersNav.propTypes = {
  openMap: PropTypes.func,
  openSankey: PropTypes.func,
  isMapVisible: PropTypes.bool,
  links: PropTypes.array.isRequired,
  filters: PropTypes.object.isRequired
};

export default FiltersNav;
