import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import camelCase from 'lodash/camelCase';
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

  getPluralNodeType = nodeType => {
    const name = camelCase(nodeType);
    return (
      {
        country: 'countries',
        municipality: 'municipalities'
      }[name] || `${nodeType}s`.toLowerCase()
    );
  };

  getTitle(meta) {
    if (!meta || !meta.info) return '';
    const topNPart = meta.info.top_n ? `Top ${meta.info.top_n}` : null;
    const nodeTypePart = meta.info.node_type
      ? this.getPluralNodeType(meta.info.node_type)
      : 'Global overview';
    // const resizeByPart = meta.info.filter.cont_attribute;
    // const recolorByPart = meta.info.filter.ncont_attribute
    //   ? `broken by ${meta.info.filter.ncont_attribute}`
    //   : null;

    return [topNPart, nodeTypePart].filter(Boolean).join(' ');
  }

  render() {
    const { data, loading, error, meta, config, chartsLoading, setActiveModal, activeModal  } = this.props;
    const title = this.getTitle(meta);
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
  config: PropTypes.object,
  chartsLoading: PropTypes.bool,
  setActiveModal: PropTypes.func.isRequired,
  activeModal: PropTypes.string
};

export default connect(
  makeMapStateToProps,
  mapDispatchToProps
)(DashboardWidgetContainer);
