import capitalize from 'lodash/capitalize';
import { getSelectedContext } from 'reducers/app.selectors';
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
    case 'profileRoot':
    case 'profileNode':
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
    default:
      return 'TRASE';
  }
}
