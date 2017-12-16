import { h } from 'preact';
import ContextSelector from 'containers/tool/nav/context-selector.container';
import Filters from 'containers/tool/nav/filters.container';
import Years from 'containers/tool/nav/years.container';
import ResizeBy from 'containers/tool/nav/resize-by.container';
import RecolorBy from 'containers/tool/nav/recolor-by.container';
import View from 'containers/tool/nav/view.container';

const Nav = ({ tooltips, selectedContext }) => {

  if (tooltips === undefined || selectedContext === undefined) {
    return;
  }

  const hasFilters = selectedContext.filterBy && selectedContext.filterBy.length > 0;

  return (
    <nav>
      <div class='left-side'>
        <div class='nav-item -no-offset'>
          <div class='offset-container js-logo'>
            <a class='trase-logo' href='/'>
              <img src='images/logos/logo-trase-small-beta.svg' alt='TRASE' />
            </a>
          </div>
        </div>

        <ContextSelector />

        {hasFilters === true &&
          <Filters />
        }

        <Years />
      </div>

      <div class='right-side'>
        <ResizeBy />
        <RecolorBy />
        <View />
      </div>
    </nav>
  );
};

export default Nav;
