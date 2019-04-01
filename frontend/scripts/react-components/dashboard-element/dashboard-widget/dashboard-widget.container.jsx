import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import DashboardWidgetComponent from 'react-components/dashboard-element/dashboard-widget/dashboard-widget.component';
import DashboardWidgetTooltip from 'react-components/dashboard-element/dashboard-widget/dashboard-widget-tooltip';
import { makeGetConfig } from 'react-components/dashboard-element/dashboard-widget/dashboard-widget.selectors';
import { setDashboardWidgetActiveModal } from 'react-components/dashboard-element/dashboard-widget/dashboard-widget.actions';

const makeMapStateToProps = () => {
  const getDashboardWidgetsConfig = makeGetConfig();
  const mapStateToProps = (state, props) => ({
    config: getDashboardWidgetsConfig(state, props),
    chartsLoading: state.dashboardElement.chartsLoading,
    activeModal: state.dashboardWidget.activeModal && state.dashboardWidget.activeModal.modal
  });
  return mapStateToProps;
};

const mapDispatchToProps = dispatch => ({
  setActiveModal: modal => dispatch(setDashboardWidgetActiveModal({ modal }))
});

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
    const { data, loading, error, meta, title, config, chartsLoading, setActiveModal, activeModal  } = this.props;
    return config ? (
      <DashboardWidgetComponent
        data={data}
        title={title}
        error={error}
        loading={loading || chartsLoading}
        chartConfig={this.addTooltipContentToConfig(config, meta)}
        setActiveModal={setActiveModal}
        activeModal={activeModal}
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
  chartsLoading: PropTypes.bool,
  setActiveModal: PropTypes.func.isRequired,
  activeModal: PropTypes.string
};

export default connect(
  makeMapStateToProps,
  mapDispatchToProps
)(DashboardWidgetContainer);
