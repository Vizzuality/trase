import React from 'react';
import PropTypes from 'prop-types';
import sortBy from 'lodash/sortBy';
import DashboardWidgetContainer from 'react-components/dashboard-element/dashboard-widget/dashboard-widget.container';
import Widget from 'react-components/widgets/widget.component';
import { PARSED_CHART_TYPES } from './dashboard-widget.selectors';

function DashboardWidgetFetch(props) {
  const { url, title, dynamicSentenceParts, chartType, selectedRecolorBy } = props;
  const type = PARSED_CHART_TYPES[chartType];
  const topN = {
    horizontalBar: 10,
    horizontalStackedBar: 10,
    ranking: 50
  }[type];
  
  const chartUrl = typeof topN !== 'undefined' ? `${url}&top_n=${topN - 1}` : url;
  return (
    <Widget raw={[true]} query={[chartUrl]} params={[]}>
      {({ data, loading, error, meta }) => (
        <DashboardWidgetContainer
          title={title}
          error={error}
          loading={loading}
          chartType={chartType}
          meta={meta && meta[chartUrl]}
          selectedRecolorBy={selectedRecolorBy}
          data={sortBy(data && data[chartUrl], 'x')}
          dynamicSentenceParts={dynamicSentenceParts}
        />
      )}
    </Widget>
  );
}

DashboardWidgetFetch.propTypes = {
  url: PropTypes.string,
  chartType: PropTypes.string,
  selectedRecolorBy: PropTypes.object,
  dynamicSentenceParts: PropTypes.array
};

export default DashboardWidgetFetch;
