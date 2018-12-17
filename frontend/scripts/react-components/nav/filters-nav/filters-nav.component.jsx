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

class FiltersNav extends React.PureComponent {
  state = {
    menuOpen: false
  };

  toggleMenu = () => this.setState(state => ({ menuOpen: !state.menuOpen }));

  renderMenuButton = () => {
    const { menuOpen } = this.state;
    return menuOpen ? (
      <button className="c-burger open" onClick={this.toggleMenu}>
        <span className="ingredient" />
        <span className="ingredient" />
        <span className="ingredient" />
      </button>
    ) : (
      <button className="filters-nav-item-logo" onClick={this.toggleMenu}>
        <img src="/images/logos/logo-trase-small-beta.svg" alt="TRASE" />
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
    const navLinks = filters.toolLinks ? restOfLinks : decoratedLinks;

    return (
      <React.Fragment>
        <div className="filters-nav-left-section">
          {filters.toolLinks && this.renderInToolLinks()}
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

  renderMenuClosed = () => {
    const { selectedContext, filters, selectContexts } = this.props;
    // TODO: refactor this so that the rendered filters aren't connected to redux
    // Them being connected makes it hard to reuse without changing stuff in other pages
    return (
      <React.Fragment>
        <div className="filters-nav-left-section">
          {filters.contextSelector && (
            <ContextSelector
              className="filters-nav-item"
              selectedContext={selectedContext}
              selectContexts={selectContexts}
            />
          )}
          {filters.adminLevel && <AdminLevelFilter className="filters-nav-item" />}
          {filters.year && <YearsSelector className="filters-nav-item" />}
          {filters.yearsDropdown && <YearsDropdownSelector className="filters-nav-item" />}
        </div>
        <div className="filters-nav-right-section">
          {filters.resizeBy && <ResizeBySelector className="filters-nav-item" />}
          {filters.recolorBy && <RecolorBySelector className="filters-nav-item" />}
          {filters.viewSelector && <ViewSelector className="filters-nav-item" />}
          {filters.toolSearch && <ToolSearch className="filters-nav-item -no-padding" />}
        </div>
      </React.Fragment>
    );
  };

  render() {
    const { menuOpen } = this.state;
    return (
      <div className="c-filters-nav">
        <div className="filters-nav-item -no-padding">{this.renderMenuButton()}</div>
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
  selectContexts: PropTypes.func,
  selectedContext: PropTypes.object,
  links: PropTypes.array.isRequired,
  filters: PropTypes.object.isRequired
};

export default FiltersNav;
