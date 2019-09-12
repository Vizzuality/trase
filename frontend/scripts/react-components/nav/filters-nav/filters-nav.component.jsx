/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import RecolorBySelector from 'react-components/nav/filters-nav/recolor-by-selector';
import YearsSelector from 'react-components/nav/filters-nav/years-selector';
import LocaleSelector from 'react-components/nav/locale-selector/locale-selector.container';
import NavLinksList from 'react-components/nav/nav-links.component';
import ContextSelector from 'react-components/shared/context-selector/context-selector.container';
import NavDropdownSelector from 'react-components/nav/filters-nav/nav-dropdown-selector';
import ToolSearch from 'react-components/tool/tool-search/tool-search.container';
import { NavLink } from 'redux-first-router-link';
import Img from 'react-components/shared/img';

import 'scripts/react-components/nav/filters-nav/filters-nav.scss';
import 'scripts/react-components/nav/filters-nav/burger.scss';

class FiltersNav extends React.PureComponent {
  static propTypes = {
    openMap: PropTypes.func,
    openSankey: PropTypes.func,
    isMapVisible: PropTypes.bool,
    toggleDropdown: PropTypes.func,
    currentDropdown: PropTypes.string,
    links: PropTypes.array.isRequired,
    filters: PropTypes.object.isRequired,
    openLogisticsMapDownload: PropTypes.func
  };

  FILTERS = [ContextSelector, YearsSelector, NavDropdownSelector, RecolorBySelector];

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
        <Img src="/images/logos/logo-trase-small-beta.svg" alt="TRASE" />
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
    const supplyChainLink = ENABLE_REDESIGN_PAGES
      ? links.find(link => link.page?.type === 'explore')
      : links.find(
          link => link.page?.type === 'tool' && !link.page?.payload?.serializerParams?.isMapVisible
        );

    const mapLink = links.find(
      link => link.page?.type === 'tool' && link.page?.payload?.serializerParams?.isMapVisible
    );
    const renderToolLinks = ENABLE_REDESIGN_PAGES ? (
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
    ) : (
      <>
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
      </>
    );
    return (
      <ul className="filters-nav-submenu-list">
        <li className="filters-nav-item">
          <NavLink exact strict className="filters-nav-link" to={{ type: 'home' }}>
            home
          </NavLink>
        </li>
        {renderToolLinks}
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
          {filters.showSearch && <ToolSearch className="filters-nav-item -no-padding" />}
        </div>
      </React.Fragment>
    );
  };

  renderFilter(filter) {
    const { toggleDropdown, currentDropdown } = this.props;
    const Component = this.FILTERS[filter.type];

    return React.createElement(Component, {
      currentDropdown,
      className: 'filters-nav-item',
      onToggle: toggleDropdown,
      onSelected: this.props[`${filter.props.id}_onSelected`],
      ...filter.props,
      key: filter.props.id
    });
  }

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
        {left.map(filter => this.renderFilter(filter))}
      </div>
    );
  };

  renderRightSection = () => {
    const {
      openLogisticsMapDownload,
      filters: { right = [], showSearch, showLogisticsMapDownload }
    } = this.props;

    return (
      <div className="filters-nav-left-section">
        {right.map(filter => this.renderFilter(filter))}
        {showSearch && <ToolSearch className="filters-nav-item -no-padding" />}
        {showLogisticsMapDownload && (
          <button onClick={openLogisticsMapDownload} className="filters-nav-item -no-padding -icon">
            <svg className="icon icon-download">
              <use xlinkHref="#icon-download" />
            </svg>
          </button>
        )}
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

export default FiltersNav;
