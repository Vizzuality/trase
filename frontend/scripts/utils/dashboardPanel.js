import invert from 'lodash/invert';
import { DASHBOARD_STEPS } from 'constants';

const PANEL_IDS = invert(DASHBOARD_STEPS);
export const getPanelId = step => {
  const panelId = PANEL_IDS[step];

  if (panelId === 'welcome') {
    // welcome is not a panel but a step.
    // A panel is an abstract thing used by dashboardElement reducer to fetch stuff
    return null;
  }
  return panelId;
};

export const getPanelLabel = step =>
  step === DASHBOARD_STEPS.destinations ? 'import countries' : PANEL_IDS[step];
