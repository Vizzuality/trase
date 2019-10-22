import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import kebabCase from 'lodash/kebabCase';
import Chart from 'react-components/chart';
import SimpleModal from 'react-components/shared/simple-modal/simple-modal.component';
import TableModal from 'react-components/shared/table-modal';
import Button from 'react-components/shared/button';
import Spinner from 'react-components/shared/shrinking-spinner/shrinking-spinner.component';
import DashboardWidgetLabel from 'react-components/dashboard-element-legacy/dashboard-widget/dashboard-widget-label.component';
import DashboardWidgetLegend from 'react-components/dashboard-element-legacy/dashboard-widget/dashboard-widget-legend/dashboard-widget-legend.component';
import DynamicSentenceWidget from 'react-components/dashboard-element-legacy/dashboard-widget/dynamic-sentence-widget';
import NodeIndicatorSentenceWidget from 'react-components/dashboard-element-legacy/dashboard-widget/node-indicator-sentence-widget';
import RankingWidget from 'react-components/dashboard-element-legacy/dashboard-widget/ranking-widget';
import ErrorCatch from 'react-components/shared/error-catch.component';
import Text from 'react-components/shared/text';
import Heading from 'react-components/shared/heading';
import Dropdown from 'react-components/shared/dropdown';

import 'react-components/dashboard-element-legacy/dashboard-widget/dashboard-widget.scss';

function DashboardWidget(props) {
  const {
    loading,
    error,
    data,
    meta,
    chartType,
    chartConfig,
    title,
    setActiveChartId,
    groupingOptions,
    trackOpenTableView,
    groupingActiveItem
  } = props;
  const renderError = errorMessage => (
    <Text color="white" weight="bold" variant="mono" size="lg" className="widget-centered">
      {errorMessage}
    </Text>
  );

  const [isModalOpen, openModal] = useState(false);

  const openTableModal = useCallback(() => {
    openModal(true);
    trackOpenTableView(title);
  }, [openModal, trackOpenTableView, title]);

  const closeTableModal = useCallback(() => {
    openModal(false);
  }, [openModal]);

  const renderWidgetActions = () => {
    const hasTable = loading || (data && data.length > 0 && chartType !== 'dynamicSentence');
    return (
      <div className="widget-actions">
        {hasTable && (
          <>
            <Button
              icon="icon-table"
              color="charcoal"
              variant="circle"
              onClick={openTableModal}
              disabled={loading}
            />
            <SimpleModal isOpen={isModalOpen} onRequestClose={closeTableModal}>
              <TableModal title={title} data={data} meta={meta} chartType={chartType} />
            </SimpleModal>
          </>
        )}
      </div>
    );
  };

  const renderChart = () => {
    if (data && data.length === 0) {
      return (
        <div className="widget-centered background-no-data">
          <Text color="white" weight="bold" variant="mono" size="lg">
            No data available.
          </Text>
        </div>
      );
    }

    switch (chartConfig.type) {
      case 'nodeIndicatorSentence':
        return (
          <div className="dynamic-sentence-widget" data-test="widget-node-indicator-sentence">
            <NodeIndicatorSentenceWidget data={data} meta={meta} config={chartConfig} />
          </div>
        );
      case 'sentence':
        return (
          <div className="dynamic-sentence-widget" data-test="widget-dynamic-sentence">
            <DynamicSentenceWidget data={data} config={chartConfig} />
          </div>
        );
      case 'ranking':
        return (
          <div className="widget-centered" data-test="widget-ranking">
            <RankingWidget data={data} meta={meta} config={chartConfig} />
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
            <Chart
              className="widget-chart"
              data={data}
              meta={meta}
              config={chartConfig}
              testId="widget-chart"
            />
          </React.Fragment>
        );
    }
  };

  return (
    <div className="c-dashboard-widget">
      <div className="widget-title-container">
        <Heading as="h3" color="white">
          {title}
          {groupingOptions && title && (
            <Dropdown
              size="rg"
              showSelected
              color="white"
              weight="light"
              variant="sentence"
              options={groupingOptions}
              value={groupingActiveItem}
              label={`${title}-${kebabCase(groupingActiveItem.label)}`}
              onChange={item => setActiveChartId(item.value)}
            />
          )}
        </Heading>
        {renderWidgetActions()}
      </div>
      <div className="widget-box">
        <ErrorCatch renderFallback={err => renderError(`Error: ${err.message}`)}>
          {error && renderError(`Error: ${error.statusText}`)}
          {loading && (
            <div className="widget-spinner" data-test="widget-spinner">
              <Spinner className="-large -white" />
            </div>
          )}
          {!loading && chartConfig && renderChart()}
        </ErrorCatch>
      </div>
    </div>
  );
}

DashboardWidget.propTypes = {
  error: PropTypes.any,
  data: PropTypes.array,
  meta: PropTypes.object,
  title: PropTypes.string,
  loading: PropTypes.bool,
  trackOpenTableView: PropTypes.func,
  chartConfig: PropTypes.object,
  chartType: PropTypes.string,
  setActiveChartId: PropTypes.func,
  groupingOptions: PropTypes.array,
  groupingActiveItem: PropTypes.object
};

export default DashboardWidget;
