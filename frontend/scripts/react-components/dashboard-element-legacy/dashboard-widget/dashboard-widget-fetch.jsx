import React, { useState, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import sortBy from 'lodash/sortBy';
import DashboardWidgetContainer from 'react-components/dashboard-element-legacy/dashboard-widget/dashboard-widget.container';
import Widget from 'react-components/widgets/widget.component';
import { PARSED_CHART_TYPES } from './dashboard-widget.selectors';

function DashboardWidgetFetch(props) {
  const { chart, grouping, dynamicSentenceParts, selectedRecolorBy } = props;
  const hasGrouping = typeof grouping?.defaultChartId !== 'undefined';

  const [activeChartId, setActiveChartId] = useState(hasGrouping ? grouping.defaultChartId : null);
  useEffect(() => {
    if (hasGrouping) {
      setActiveChartId(grouping.defaultChartId);
    }
  }, [grouping, hasGrouping]);

  const activeChart = useMemo(() => {
    if (hasGrouping) {
      return chart.items[activeChartId];
    }
    return chart;
  }, [activeChartId, chart, hasGrouping]);

  const chartUrl = useMemo(() => {
    if (activeChart) {
      const type = PARSED_CHART_TYPES[activeChart.type];
      const topN =
        {
          ranking: 50
        }[type] || 10;

      return typeof topN !== 'undefined' ? `${activeChart.url}&top_n=${topN - 1}` : activeChart.url;
    }
    return null;
  }, [activeChart]);

  if (!activeChart) {
    return null;
  }

  return (
    <Widget raw={[true]} query={[chartUrl]} params={[]}>
      {({ data, loading, error, meta }) => (
        <DashboardWidgetContainer
          error={error}
          loading={loading}
          chartType={activeChart.type}
          meta={meta && meta[chartUrl]}
          selectedRecolorBy={selectedRecolorBy}
          data={sortBy(data && data[chartUrl], 'x')}
          dynamicSentenceParts={dynamicSentenceParts}
          activeChartId={activeChartId}
          setActiveChartId={setActiveChartId}
          grouping={grouping}
        />
      )}
    </Widget>
  );
}

DashboardWidgetFetch.propTypes = {
  chart: PropTypes.object,
  grouping: PropTypes.object,
  selectedRecolorBy: PropTypes.object,
  dynamicSentenceParts: PropTypes.array
};

export default DashboardWidgetFetch;
