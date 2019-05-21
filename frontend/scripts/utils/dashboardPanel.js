import invert from 'lodash/invert';
import { DASHBOARD_STEPS } from 'constants';

const PANEL_IDS = invert(DASHBOARD_STEPS);
export const getPanelId = step => PANEL_IDS[step];

export const singularize = panelName => {
  const irregularInflections = {
    commodities: 'commodity'
  };
  return irregularInflections[panelName] || panelName.substring(0, panelName.length - 1);
};
