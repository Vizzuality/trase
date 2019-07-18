import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import DashboardWidgetComponent from 'react-components/dashboard-element/dashboard-widget/dashboard-widget.component';
import DashboardWidgetTooltip from 'react-components/dashboard-element/dashboard-widget/dashboard-widget-tooltip';
import {
  getChartType,
  makeGetConfig,
  makeGetTitle,
  makeGetGroupingOptions,
  makeGetGroupingActiveItem
} from 'react-components/dashboard-element/dashboard-widget/dashboard-widget.selectors';
import { trackOpenTableView as trackOpenTableViewFn } from 'react-components/dashboard-element/dashboard-widget/dashboard-widget.actions';

const makeMapStateToProps = () => {
  const getDashboardWidgetsConfig = makeGetConfig();
  const getTitle = makeGetTitle();
  const getGroupingOptions = makeGetGroupingOptions();
  const getGroupingActiveItem = makeGetGroupingActiveItem();
  const mapStateToProps = (state, props) => ({
    title: getTitle(state, props),
    chartType: getChartType(state, props),
    config: getDashboardWidgetsConfig(state, props),
    chartsLoading: state.dashboardElement.chartsLoading,
    groupingOptions: getGroupingOptions(state, props),
    groupingActiveItem: getGroupingActiveItem(state, props)
  });
  return mapStateToProps;
};

const mapDispatchToProps = {
  trackOpenTableView: trackOpenTableViewFn
};

class DashboardWidgetContainer extends Component {
  addTooltipContentToConfig(config, meta) {
    return {
      ...config,
      tooltip: {
        ...config.tooltip,
        content: <DashboardWidgetTooltip meta={meta} />
      }
    };
  }

  render() {
    const {
      data,
      loading,
      error,
      meta,
      config,
      chartType,
      chartsLoading,
      title,
      groupingActiveItem,
      setActiveChart,
      groupingOptions,
      trackOpenTableView
    } = this.props;
    return config ? (
      <DashboardWidgetComponent
        data={data}
        meta={meta}
        error={error}
        title={title}
        chartType={chartType}
        setActiveChart={setActiveChart}
        groupingOptions={groupingOptions}
        loading={loading || chartsLoading}
        groupingActiveItem={groupingActiveItem}
        trackOpenTableView={trackOpenTableView}
        chartConfig={this.addTooltipContentToConfig(config, meta)}
      />
    ) : null;
  }
}

DashboardWidgetContainer.propTypes = {
  error: PropTypes.bool,
  data: PropTypes.array,
  meta: PropTypes.object,
  loading: PropTypes.bool,
  title: PropTypes.string,
  config: PropTypes.object,
  chartType: PropTypes.string,
  chartsLoading: PropTypes.bool,
  setActiveChart: PropTypes.func,
  groupingOptions: PropTypes.array,
  trackOpenTableView: PropTypes.func,
  groupingActiveItem: PropTypes.object
};

export default connect(
  makeMapStateToProps,
  mapDispatchToProps
)(DashboardWidgetContainer);
