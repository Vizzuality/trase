import { createSelector } from 'reselect';
import { getPanelId } from 'utils/toolPanel';
import { TOOL_STEPS } from 'constants';
import { getDraftDynamicSentence } from 'react-components/dashboard-element/dashboard-element.selectors';

export const getIsDisabled = createSelector(
  [getDraftDynamicSentence, (state, ownProps) => ownProps.step],
  (dynamicSentence, step) => {
    if (typeof step === 'undefined') {
      return true;
    }
    const currentPanel = getPanelId(step);
    if (!dynamicSentence.length || currentPanel === null || step === TOOL_STEPS.welcome) {
      return false;
    }

    const currentSentencePart = dynamicSentence.find(p => p.panel === currentPanel);
    return !currentSentencePart.optional && !currentSentencePart.value.length > 0;
  }
);
