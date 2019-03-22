import { getConfig } from 'react-components/dashboard-element/dashboard-widget/dashboard-widget.selectors';
import CHART_CONFIG from 'react-components/dashboard-element/dashboard-widget/dashboard-widget-config';
import { meta, yKeys, colors, parsedConfig } from 'scripts/tests/dashboard-widget/selectors.mocks';

describe('Widget config parse selectors', () => {
  describe('getConfig', () => {
    it('returns the defaultConfig if there is no meta', () => {
      expect(getConfig.resultFunc(null, yKeys, colors, CHART_CONFIG.line)).toEqual(
        CHART_CONFIG.line
      );
    });

    it('Parses the config', () => {
      expect(getConfig.resultFunc(meta, yKeys, colors, CHART_CONFIG.line)).toEqual(parsedConfig);
    });
  });
});
