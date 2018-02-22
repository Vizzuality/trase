import React from 'react';
import ContextSelector from 'react-components/shared/context-selector/context-selector.container';
import Filters from 'containers/tool/nav/filters.container';
import YearsSelector from 'react-components/nav/filters-nav/years-selector/years-selector.container';
import ResizeBySelector from 'react-components/nav/filters-nav/resize-by-selector/resize-by-selector.container';
import RecolorBySelector from 'react-components/nav/filters-nav/recolor-by-selector/recolor-by-selector.container';
import ViewSelector from 'react-components/nav/filters-nav/view-selector/view-selector.container';
import PropTypes from 'prop-types';

function Nav({ tooltips, selectedContext }) {
  if (tooltips === undefined || selectedContext === null) {
    return null;
  }

  const hasFilters = selectedContext.filterBy && selectedContext.filterBy.length > 0;

  return (
    <nav>
      <div className="left-side">
        <div className="nav-item -no-offset">
          <div className="offset-container js-logo">
            <a className="trase-logo" href="/">
              <img src="images/logos/logo-trase-small-beta.svg" alt="TRASE" />
            </a>
          </div>
        </div>

        <ContextSelector className="nav-item" />

        {hasFilters === true && <Filters />}

        <YearsSelector className="nav-item js-dropdown" />
      </div>

      <div className="right-side">
        <ResizeBySelector className="nav-item" />
        <RecolorBySelector className="nav-item" />
        <ViewSelector className="nav-item" />
      </div>
    </nav>
  );
}

Nav.propTypes = {
  tooltips: PropTypes.object,
  selectedContext: PropTypes.object
};

export default Nav;
