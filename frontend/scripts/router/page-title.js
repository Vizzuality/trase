import capitalize from 'lodash/capitalize';
import startCase from 'lodash/startCase';
import { getSelectedContext } from 'app/app.selectors';
import { getDashboardsContext } from 'react-components/dashboard-element/dashboard-element.selectors';
import { TOOL_LAYOUT } from 'constants';

export default function(state) {
  const selectedContext = getSelectedContext(state);
  switch (state.location.type) {
    case 'about':
      return 'TRASE - About TRASE';
    case 'team':
      return 'TRASE - Team';
    case 'data':
      return 'TRASE - Data Download';
    case 'profiles':
    case 'profile':
      return 'TRASE - Profiles';
    case 'tool':
      if (!selectedContext) {
        if (state.toolLayers.toolLayout === TOOL_LAYOUT.left) {
          return 'TRASE - Map';
        }
        return 'TRASE - Supply Chain';
      }

      return `TRASE - ${capitalize(selectedContext.countryName)} ${capitalize(
        selectedContext.commodityName
      )}`;
    case 'explore':
      if (!selectedContext || !state.app.contextIsUserSelected) {
        return 'TRASE - Explore';
      }

      return `TRASE - ${capitalize(selectedContext.countryName)} ${capitalize(
        selectedContext.commodityName
      )}`;
    case 'dashboardRoot':
      return 'TRASE - Dashboards';
    case 'dashboardElement': {
      const id = state.location?.payload?.dashboardId;
      const dashboardContext = getDashboardsContext(state);
      if (id === 'new') {
        if (dashboardContext) {
          return `TRASE - Dashboard - ${capitalize(dashboardContext.countryName)} ${capitalize(
            dashboardContext.commodityName
          )}`;
        }
        return 'TRASE - New Dashboard';
      }
      return `TRASE - ${capitalize(startCase(id))}`;
    }
    default:
      return 'TRASE';
  }
}
