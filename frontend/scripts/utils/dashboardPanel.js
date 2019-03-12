import invert from 'lodash/invert';
import { DASHBOARD_STEPS } from 'constants';

export const getPanelId = step => {
  const panelIds = invert(DASHBOARD_STEPS);
  return panelIds && panelIds[step] && panelIds[step];
};

export const singularize = panelName => {
  const irregularInflections = {
    commodities: 'commodity'
  };
  return irregularInflections[panelName] || panelName.substring(0, panelName.length - 1);
};
