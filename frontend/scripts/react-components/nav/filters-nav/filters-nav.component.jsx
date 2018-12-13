/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import AdminLevelFilter from 'react-components/nav/filters-nav/admin-level-filter/admin-level-filter.container';
import RecolorBySelector from 'react-components/nav/filters-nav/recolor-by-selector/recolor-by-selector.container';
import ResizeBySelector from 'react-components/nav/filters-nav/resize-by-selector/resize-by-selector.container';
import ViewSelector from 'react-components/nav/filters-nav/view-selector/view-selector.container';
import YearsSelector from 'react-components/nav/filters-nav/years-selector/years-selector.container';
import LocaleSelector from 'react-components/nav/locale-selector/locale-selector.container';
import NavLinksList from 'react-components/nav/nav-links.component';
import ContextSelector from 'react-components/shared/context-selector/context-selector.container';
import ToolSearch from 'react-components/tool/tool-search/tool-search.container';
import { NavLink } from 'redux-first-router-link';

import 'scripts/react-components/nav/filters-nav/filters-nav.scss';
import 'scripts/react-components/nav/filters-nav/burger.scss';

class FiltersNav extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      menuOpen: false
    };
    this.toggleMenu = this.toggleMenu.bind(this);
    this.renderMenuButton = this.renderMenuButton.bind(this);
    this.renderMenuOpened = this.renderMenuOpened.bind(this);
    this.renderMenuClosed = this.renderMenuClosed.bind(this);
  }

  toggleMenu() {
    this.setState(state => ({ menuOpen: !state.menuOpen }));
  }

  renderMenuButton() {
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
  }

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

  renderMenuOpened() {
    const { links, isExplore } = this.props;
    const [, , ...restOfLinks] = links;
    const decoratedLinks = [{ name: 'Home', page: { type: 'home' } }, ...links];
    const navLinks = isExplore ? decoratedLinks : restOfLinks;

    return (
      <React.Fragment>
        <div className="filters-nav-left-section">
          {!isExplore && this.renderInToolLinks()}
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
  }

  renderMenuClosed() {
    const { selectedContext, isExplore, contextIsUserSelected } = this.props;
    return (
      <React.Fragment>
        <div className="filters-nav-left-section">
          <ContextSelector
            className="filters-nav-item"
            isExplore={isExplore}
            selectedContext={selectedContext}
          />
          {selectedContext && (contextIsUserSelected || !isExplore) && (
            <React.Fragment>
              {!isExplore && <AdminLevelFilter className="filters-nav-item" />}
              <YearsSelector className="filters-nav-item" />
            </React.Fragment>
          )}
        </div>
        <div className="filters-nav-right-section">
          {!isExplore && (
            <React.Fragment>
              {selectedContext && (
                <React.Fragment>
                  <ResizeBySelector className="filters-nav-item" />
                  <RecolorBySelector className="filters-nav-item" />
                  <ViewSelector className="filters-nav-item" />
                </React.Fragment>
              )}
              <ToolSearch className="filters-nav-item -no-padding" />
            </React.Fragment>
          )}
        </div>
      </React.Fragment>
    );
  }

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
  contextIsUserSelected: PropTypes.bool,
  isExplore: PropTypes.bool.isRequired,
  isMapVisible: PropTypes.bool,
  links: PropTypes.array.isRequired,
  openMap: PropTypes.func,
  openSankey: PropTypes.func,
  selectedContext: PropTypes.object
};

export default FiltersNav;
