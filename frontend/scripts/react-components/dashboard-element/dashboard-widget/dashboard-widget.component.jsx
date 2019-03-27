import React from 'react';
import PropTypes from 'prop-types';
import Chart from 'react-components/chart';
import Spinner from 'react-components/shared/shrinking-spinner/shrinking-spinner.component';
import DashboardWidgetLabel from 'react-components/dashboard-element/dashboard-widget/dashboard-widget-label.component';
import DashboardWidgetLegend from 'react-components/dashboard-element/dashboard-widget/dashboard-widget-legend/dashboard-widget-legend.component';
import DynamicSentenceWidget from 'react-components/dashboard-element/dashboard-widget/dynamic-sentence-widget';
import ErrorCatch from 'react-components/shared/error-catch.component';
import Text from 'react-components/shared/text';
import Heading from 'react-components/shared/heading';
import DynamicSentenceWidget from 'react-components/dynamic-sentence-widget';
import RankingWidget from 'react-components/ranking-widget';
import 'react-components/dashboard-element/dashboard-widget/dashboard-widget.scss';

function DashboardWidget(props) {
  const { title, loading, error, data, chartConfig } = props;

  const renderError = errorMessage => (
    <Text color="white" weight="bold" variant="mono" size="lg" className="widget-centered">
      {errorMessage}
    </Text>
  );

  const renderChart = () => {
    switch (chartConfig.type) {
      case 'sentence':
        return (
          <div className="widget-centered">
            <DynamicSentenceWidget
              data={data}
              config={chartConfig}
              dynamicSentenceParts={dynamicSentenceParts}
            />
          </div>
        );
      case 'ranking':
        return (
          <div className="widget-centered">
            <RankingWidget data={data} />
          </div>
        );
      default:
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
    }
  };

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
          {data && data.length > 0 && chartConfig && renderChart()}
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
  chartConfig: PropTypes.object
};

export default DashboardWidget;
