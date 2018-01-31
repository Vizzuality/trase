import React from 'react';
import ContextSelector from 'containers/tool/nav/context-selector';
import Filters from 'containers/tool/nav/filters.container';
import Years from 'containers/tool/nav/years.container';
import ResizeBy from 'containers/tool/nav/resize-by.container';
import RecolorBy from 'containers/tool/nav/recolor-by.container';
import View from 'containers/tool/nav/view.container';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';

function Nav({ tooltips, selectedContext }) {
  if (isEmpty(tooltips) || isEmpty(selectedContext)) {
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

        <ContextSelector />

        {hasFilters === true && <Filters />}

        <Years />
      </div>

      <div className="right-side">
        <ResizeBy />
        <RecolorBy />
        <View />
      </div>
    </nav>
  );
}

Nav.propTypes = {
  tooltips: PropTypes.object,
  selectedContext: PropTypes.object
};

export default Nav;
