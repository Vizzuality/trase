import React from 'react';
import PropTypes from 'prop-types';
import DashboardWidget from 'react-components/dashboard-element/dashboard-widget/dashboard-widget.component';
import Widget from 'react-components/widgets/widget.component';
import CHART_CONFIG from 'react-components/dashboard-element/dashboard-widget/dashboard-widget-config';

function DashboardWidgetContainer(props) {
  const { url, title, chartType } = props;
  return (
    <Widget raw query={[url]} params={[{ title }]}>
      {({ data, loading, error }) => (
        <DashboardWidget
          data={data && data[url]}
          error={error}
          title={title}
          loading={loading}
          chartConfig={CHART_CONFIG[chartType]}
        />
      )}
    </Widget>
  );
}

DashboardWidgetContainer.propTypes = {
  url: PropTypes.string,
  title: PropTypes.string,
  chartType: PropTypes.string
};

export default DashboardWidgetContainer;
