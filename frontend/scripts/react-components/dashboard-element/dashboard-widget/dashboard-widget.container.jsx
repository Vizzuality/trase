import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import DashboardWidgetComponent from 'react-components/dashboard-element/dashboard-widget/dashboard-widget.component';
import DashboardWidgetTooltip from 'react-components/dashboard-element/dashboard-widget/dashboard-widget-tooltip';
import { makeGetConfig } from 'react-components/dashboard-element/dashboard-widget/dashboard-widget.selectors';

const makeMapStateToProps = () => {
  const getDashboardWidgetsConfig = makeGetConfig();
  const mapStateToProps = (state, props) => ({
    config: getDashboardWidgetsConfig(state, props)
  });
  return mapStateToProps;
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
    const { data, loading, error, meta, title, config, dynamicSentenceParts } = this.props;
    return config ? (
      <DashboardWidgetComponent
        title={title}
        error={error}
        loading={loading}
        data={data}
        chartConfig={this.addTooltipContentToConfig(config, meta)}
        dynamicSentenceParts={dynamicSentenceParts}
      />
    ) : null;
  }
}

DashboardWidgetContainer.propTypes = {
  loading: PropTypes.bool,
  error: PropTypes.bool,
  title: PropTypes.string,
  data: PropTypes.array,
  meta: PropTypes.object,
  config: PropTypes.object,
  dynamicSentenceParts: PropTypes.array
};

export default connect(makeMapStateToProps)(DashboardWidgetContainer);
