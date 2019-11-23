import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import React from 'react';
import PropTypes from 'prop-types';
import DashboardElement from 'react-components/dashboard-element/dashboard-element.component';
import {
  getDynamicSentence,
  getDashboardFiltersProps,
  getDashboardGroupedCharts,
  getDashboardElementUrlProps
} from 'react-components/dashboard-element/dashboard-element.selectors';
import dashboardElementSerializer from 'react-components/dashboard-element/dashboard-element.serializers';
import nodesPanelSerializer from 'react-components/nodes-panel/nodes-panel.serializers';
import {
  getDirtyBlocks,
  getNodesPanelUrlProps
} from 'react-components/nodes-panel/nodes-panel.selectors';
import {
  setDashboardSelectedYears,
  setDashboardSelectedResizeBy,
  setDashboardSelectedRecolorBy,
  editDashboard as editDashboardFn,
  goToDashboard as goToDashboardFn
} from 'react-components/dashboard-element/dashboard-element.actions';
import {
  editPanels as editPanelsFn,
  savePanels as savePanelsFn
} from 'react-components/nodes-panel/nodes-panel.actions';
import { DASHBOARD_STEPS } from 'constants';

const getUrlProps = createSelector(
  [getDashboardElementUrlProps, getNodesPanelUrlProps],
  (dashboardElementProps, nodesPanelProps) => ({ ...dashboardElementProps, ...nodesPanelProps })
);

const _urlPropHandlers = {
  ...dashboardElementSerializer.urlPropHandlers,
  ...nodesPanelSerializer.urlPropHandlers
};

const mapStateToProps = state => {
  const dirtyBlocks = getDirtyBlocks(state);
  return {
    dirtyBlocks,
    urlPropHandlers: _urlPropHandlers,
    loading: state.dashboardElement.loading,
    groupedCharts: getDashboardGroupedCharts(state),
    filters: getDashboardFiltersProps(state),
    dynamicSentenceParts: getDynamicSentence(state),
    showModalOnStart: !(dirtyBlocks.countries && dirtyBlocks.commodities),
    urlProps: getUrlProps(state)
  };
};

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      goToRoot: () => ({ type: 'dashboardRoot' }),
      setSelectedYears: setDashboardSelectedYears,
      setSelectedResizeBy: setDashboardSelectedResizeBy,
      setSelectedRecolorBy: setDashboardSelectedRecolorBy,
      editDashboard: editDashboardFn,
      editPanels: editPanelsFn,
      savePanels: savePanelsFn,
      goToDashboard: goToDashboardFn
    },
    dispatch
  );

class DashboardElementContainer extends React.Component {
  static propTypes = {
    loading: PropTypes.bool,
    filters: PropTypes.object,
    urlProps: PropTypes.object,
    dirtyBlocks: PropTypes.object,
    groupedCharts: PropTypes.object,
    urlPropHandlers: PropTypes.object,
    showModalOnStart: PropTypes.bool,
    goToRoot: PropTypes.func.isRequired,
    dynamicSentenceParts: PropTypes.array,
    editDashboard: PropTypes.func.isRequired,
    editPanels: PropTypes.func.isRequired,
    setSelectedYears: PropTypes.func.isRequired,
    setSelectedResizeBy: PropTypes.func.isRequired,
    setSelectedRecolorBy: PropTypes.func.isRequired
  };

  hasVisitedBefore = {
    key: 'TRASE__HAS_VISITED_DASHBOARDS_BEFORE',
    get() {
      return !ALWAYS_DISPLAY_DASHBOARD_INFO && localStorage.getItem(this.key);
    },
    set(key) {
      return localStorage.setItem(this.key, key);
    }
  };

  state = {
    modalOpen: this.props.showModalOnStart,
    step: this.hasVisitedBefore.get() ? DASHBOARD_STEPS.sources : DASHBOARD_STEPS.welcome
  };

  componentDidMount() {
    if (!this.hasVisitedBefore.get()) {
      this.hasVisitedBefore.set(Date.now());
    }
  }

  closeModal = () => this.setState({ modalOpen: false });

  reopenPanel = () => {
    this.props.editDashboard();
    this.props.editPanels();
    this.setState({ step: 0, modalOpen: true });
  };

  updateStep = step => this.setState({ step });

  render() {
    const { step, modalOpen } = this.state;
    const {
      loading,
      groupedCharts,
      goToRoot,
      urlProps,
      urlPropHandlers,
      dynamicSentenceParts,
      dirtyBlocks,
      filters,
      setSelectedYears,
      setSelectedResizeBy,
      setSelectedRecolorBy
    } = this.props;
    return (
      <DashboardElement
        step={step}
        loading={loading}
        filters={filters}
        urlProps={urlProps}
        goToRoot={goToRoot}
        modalOpen={modalOpen}
        dirtyBlocks={dirtyBlocks}
        setStep={this.updateStep}
        closeModal={this.closeModal}
        groupedCharts={groupedCharts}
        reopenPanel={this.reopenPanel}
        urlPropHandlers={urlPropHandlers}
        dynamicSentenceParts={dynamicSentenceParts}
        setSelectedYears={setSelectedYears}
        setSelectedResizeBy={setSelectedResizeBy}
        setSelectedRecolorBy={setSelectedRecolorBy}
      />
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DashboardElementContainer);
