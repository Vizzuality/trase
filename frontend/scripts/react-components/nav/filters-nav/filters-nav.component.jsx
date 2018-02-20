import React from 'react';
import PropTypes from 'prop-types';

function FiltersNav(props) {
  const { children } = props;
  return (
    <div className="c-filters-nav">
      <div className="hamburger">
        <span className="ingredient" />
        <span className="ingredient" />
        <span className="ingredient" />
      </div>
      {children}
    </div>
  );
}

FiltersNav.propTypes = {
  children: PropTypes.element
};

export default FiltersNav;
