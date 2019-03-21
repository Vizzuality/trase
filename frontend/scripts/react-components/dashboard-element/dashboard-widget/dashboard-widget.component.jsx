import React from 'react';
import PropTypes from 'prop-types';
import Chart from 'react-components/chart';
import Spinner from 'react-components/shared/shrinking-spinner/shrinking-spinner.component';
import DashboardWidgetLabel from 'react-components/dashboard-element/dashboard-widget/dashboard-widget-label.component';
import DashboardWidgetLegend from 'react-components/dashboard-element/dashboard-widget/dashboard-widget-legend/dashboard-widget-legend.component';
import ErrorCatch from 'react-components/shared/error-catch.component';
import Text from 'react-components/shared/text';
import Heading from 'react-components/shared/heading';
import DynamicSentenceWidget from 'react-components/dynamic-sentence-widget';
import 'react-components/dashboard-element/dashboard-widget/dashboard-widget.scss';

const renderChart = ({ data, chartConfig, dynamicSentenceParts }) => {
  if (chartConfig.type === 'sentence') {
    return (
      <div className="widget-centered">
        <DynamicSentenceWidget
          data={data}
          config={chartConfig}
          dynamicSentenceParts={dynamicSentenceParts}
        />
      </div>
    );
  }
  return (
    <React.Fragment>
      <DashboardWidgetLegend colors={chartConfig.colors} />
      {chartConfig.yAxisLabel && (
        <DashboardWidgetLabel
          text={chartConfig.yAxisLabel.text}
          suffix={chartConfig.yAxisLabel.suffix}
        />
      )}
      <Chart className="widget-chart" data={data} config={chartConfig} />
    </React.Fragment>
  );
};

renderChart.propTypes = {
  data: PropTypes.array,
  chartConfig: PropTypes.object,
  dynamicSentenceParts: PropTypes.object
};

const renderError = error => (
  <Text color="white" weight="bold" variant="mono" size="lg" className="widget-centered">
    {error}
  </Text>
);

function DashboardWidget(props) {
  const { title, loading, error, data, chartConfig, dynamicSentenceParts } = props;

  return (
    <div className="c-dashboard-widget">
      <div className="widget-title-container">
        <Heading as="h3" color="white">
          {title}
        </Heading>
        <div className="widget-actions">
          <button type="button" />
          <button type="button" />
          <button type="button" />
        </div>
      </div>
      <div className="widget-box">
        <ErrorCatch renderFallback={err => renderError(`Error: ${err.message}`)}>
          {error && renderError(`Error: ${error.statusText}`)}
          {loading && (
            <div className="widget-spinner">
              <Spinner className="-large -white" />
            </div>
          )}
          {data &&
            data.length > 0 &&
            chartConfig &&
            renderChart({ data, chartConfig, dynamicSentenceParts })}
        </ErrorCatch>
      </div>
    </div>
  );
}

DashboardWidget.propTypes = {
  error: PropTypes.any,
  data: PropTypes.array,
  title: PropTypes.string,
  loading: PropTypes.bool,
  chartConfig: PropTypes.object,
  dynamicSentenceParts: PropTypes.array
};

export default DashboardWidget;
