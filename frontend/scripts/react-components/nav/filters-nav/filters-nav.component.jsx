/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useState } from 'react';
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
import { TOOL_LAYOUT } from 'constants';
import ToolModalButton from 'react-components/nav/filters-nav/tool-modal-button';

import 'scripts/react-components/nav/filters-nav/filters-nav.scss';
import 'scripts/react-components/nav/filters-nav/burger.scss';

const FILTERS = [ContextSelector, YearsSelector, NavDropdownSelector, RecolorBySelector];

const FiltersNav = props => {
  const {
    links,
    openMap,
    openSankey,
    toolLayout,
    toggleDropdown,
    currentDropdown,
    filters,
    openLogisticsMapDownload
  } = props;

  const [menuOpen, changeMenu] = useState(false);
  const toggleMenu = () => changeMenu(!menuOpen);

  const renderMenuButton = () => {
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
      <button className="filters-nav-item -no-padding" onClick={toggleMenu} type="button">
        {content}
      </button>
    );
  };

  const renderInToolLinks = () => {
    const supplyChainLink = ENABLE_REDESIGN_PAGES
      ? links.find(link => link.page?.type === 'explore')
      : links.find(
          link =>
            link.page?.type === 'tool' &&
            link.page?.payload?.serializerParams?.toolLayout !== TOOL_LAYOUT.left
        );

    const mapLink = links.find(
      link =>
        link.page?.type === 'tool' &&
        link.page?.payload?.serializerParams?.toolLayout === TOOL_LAYOUT.left
    );
    const renderToolLinks = (
      <>
        <li className="filters-nav-item">
          <span
            className={cx('filters-nav-link', {
              '-active': toolLayout !== TOOL_LAYOUT.left
            })}
            onClick={openSankey}
          >
            {supplyChainLink.name}
          </span>
        </li>
        <li className="filters-nav-item">
          <span
            className={cx('filters-nav-link', {
              '-active': toolLayout === TOOL_LAYOUT.left
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
  };

  const renderMenuOpened = () => {
    const restOfLinks = ENABLE_REDESIGN_PAGES ? links : links.slice(2);
    const decoratedLinks = [{ name: 'Home', page: { type: 'home' } }, ...links];
    const navLinks = filters.showToolLinks ? restOfLinks : decoratedLinks;
    return (
      <React.Fragment>
        <div className="filters-nav-left-section">
          {!ENABLE_REDESIGN_PAGES && filters.showToolLinks && renderInToolLinks()}
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

  const renderFilter = filter => {
    const Component = FILTERS[filter.type];
    if (ENABLE_REDESIGN_PAGES && filter.props.id === 'toolRecolorBy') {
      return <ToolModalButton modalId="indicator" />;
    }

    return React.createElement(Component, {
      currentDropdown,
      className: 'filters-nav-item',
      onToggle: toggleDropdown,
      onSelected: props[`${filter.props.id}_onSelected`],
      ...filter.props,
      key: filter.props.id
    });
  };

  const renderLeftSection = () => {
    const { left = [] } = filters;
    return (
      <div className="filters-nav-left-section">{left.map(filter => renderFilter(filter))}</div>
    );
  };

  const renderRightSection = () => {
    const { right = [], showSearch, showLogisticsMapDownload } = filters;
    return (
      <div className="filters-nav-left-section">
        {right.map(filter => renderFilter(filter))}
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

  const renderMenuClosed = () => (
    <React.Fragment>
      {renderLeftSection()}
      {renderRightSection()}
    </React.Fragment>
  );
  return (
    <div className="c-filters-nav">
      {renderMenuButton()}
      <div className="filters-nav-section-container">
        {menuOpen ? renderMenuOpened() : renderMenuClosed()}
      </div>
    </div>
  );
};

FiltersNav.propTypes = {
  openMap: PropTypes.func,
  openSankey: PropTypes.func,
  toolLayout: PropTypes.number,
  toggleDropdown: PropTypes.func,
  currentDropdown: PropTypes.string,
  links: PropTypes.array.isRequired,
  filters: PropTypes.object.isRequired,
  openLogisticsMapDownload: PropTypes.func
};

export default FiltersNav;
