import invert from 'lodash/invert';
import { TOOL_STEPS } from 'constants';

const PANEL_IDS = invert(TOOL_STEPS);
export const getPanelId = step => PANEL_IDS[step];
export const getPanelLabel = step =>
  step === TOOL_STEPS.destinations ? 'import countries' : PANEL_IDS[step];
