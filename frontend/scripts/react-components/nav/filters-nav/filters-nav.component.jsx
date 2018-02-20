import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import ContextSelector from 'react-components/shared/context-selector/context-selector.container';

class FiltersNav extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      menuOpen: false
    };
    this.toggleMenu = this.toggleMenu.bind(this);
  }

  toggleMenu() {
    this.setState(state => ({ menuOpen: !state.menuOpen }));
  }

  render() {
    const { children } = this.props;
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
        <div className="filters-nav-item">
          <ContextSelector />
        </div>
        {children}
      </div>
    );
  }
}

FiltersNav.propTypes = {
  children: PropTypes.element
};

export default FiltersNav;
