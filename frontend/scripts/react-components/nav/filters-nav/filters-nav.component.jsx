import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import ContextSelector from 'react-components/shared/context-selector/context-selector.container';
import NavLinksList from 'react-components/nav/nav-links-list.component';
import YearsSelector from 'react-components/nav/filters-nav/years-selector/years-selector.container';
import ResizeBySelector from 'react-components/nav/filters-nav/resize-by-selector/resize-by-selector.container';
import RecolorBySelector from 'react-components/nav/filters-nav/recolor-by-selector/recolor-by-selector.container';
import ViewSelector from 'react-components/nav/filters-nav/view-selector/view-selector.container';

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
      <NavLinksList
        links={links}
        listClassName="filters-nav-submenu-list"
        itemClassName="filters-nav-item"
        linkClassName="filters-nav-link"
        linkActiveClassName="filters-nav-link -active"
      />
    );
  }

  renderMenuClosed() {
    const { children, selectedContext } = this.props;
    return (
      <React.Fragment>
        <div className="filters-nav-left-section">
          <ContextSelector className="filters-nav-item" />
          {selectedContext && <YearsSelector className="filters-nav-item" />}
        </div>
        <div className="filters-nav-right-section">
          <ResizeBySelector className="filters-nav-item" />
          <RecolorBySelector className="filters-nav-item" />
          <ViewSelector className="filters-nav-item" />
          {children}
        </div>
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
        <div className="filters-nav-section-container">
          {menuOpen ? this.renderMenuOpened() : this.renderMenuClosed()}
        </div>
      </div>
    );
  }
}

FiltersNav.propTypes = {
  children: PropTypes.element,
  links: PropTypes.array.isRequired,
  selectedContext: PropTypes.object
};

export default FiltersNav;
