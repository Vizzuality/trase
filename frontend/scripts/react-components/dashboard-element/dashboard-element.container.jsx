import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import React from 'react';
import PropTypes from 'prop-types';
import DashboardElement from 'react-components/dashboard-element/dashboard-element.component';
import {
  getDirtyBlocks,
  getDynamicSentence,
  getDashboardFiltersProps,
  getDashboardGroupedCharts,
  getEditMode,
  getDashboardElementUrlProps
} from 'react-components/dashboard-element/dashboard-element.selectors';
import { getPanelId } from 'utils/dashboardPanel';
import {
  setDashboardSelectedYears,
  setDashboardSelectedResizeBy,
  setDashboardSelectedRecolorBy,
  setDashboardActivePanel as setDashboardActivePanelFn,
  editDashboard as editDashboardFn
} from 'react-components/dashboard-element/dashboard-element.actions';
import { DASHBOARD_STEPS } from 'constants';

const mapStateToProps = state => {
  const dirtyBlocks = getDirtyBlocks(state);
  return {
    dirtyBlocks,
    groupedCharts: getDashboardGroupedCharts(state),
    filters: getDashboardFiltersProps(state),
    dynamicSentenceParts: getDynamicSentence(state),
    showModalOnStart: !(dirtyBlocks.countries && dirtyBlocks.commodities),
    editMode: getEditMode(state),
    urlProps: getDashboardElementUrlProps(state)
  };
};

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      goToRoot: () => ({ type: 'dashboardRoot' }),
      setSelectedYears: setDashboardSelectedYears,
      setSelectedResizeBy: setDashboardSelectedResizeBy,
      setDashboardActivePanel: setDashboardActivePanelFn,
      setSelectedRecolorBy: setDashboardSelectedRecolorBy,
      editDashboard: editDashboardFn
    },
    dispatch
  );

class DashboardElementContainer extends React.Component {
  static propTypes = {
    groupedCharts: PropTypes.object,
    filters: PropTypes.object,
    urlProps: PropTypes.object,
    dirtyBlocks: PropTypes.object,
    showModalOnStart: PropTypes.bool,
    goToRoot: PropTypes.func.isRequired,
    dynamicSentenceParts: PropTypes.array,
    editDashboard: PropTypes.func.isRequired,
    setSelectedYears: PropTypes.func.isRequired,
    setSelectedResizeBy: PropTypes.func.isRequired,
    setSelectedRecolorBy: PropTypes.func.isRequired,
    setDashboardActivePanel: PropTypes.func.isRequired,
    editMode: PropTypes.bool
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

  componentDidUpdate(prevProps, prevState) {
    const { step } = this.state;
    if (step !== prevState.step) {
      const { setDashboardActivePanel } = this.props;
      const panelId = getPanelId(step);
      if (panelId !== null) {
        setDashboardActivePanel(panelId);
      }
    }
  }

  closeModal = () => {
    this.setState({ modalOpen: false });
  };

  reopenPanel = () => {
    this.props.editDashboard();
    this.setState({ step: 0, modalOpen: true });
  };

  updateStep = step => this.setState({ step });

  render() {
    const { editMode } = this.props;
    const { step, modalOpen } = this.state;
    const {
      groupedCharts,
      goToRoot,
      urlProps,
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
        groupedCharts={groupedCharts}
        filters={filters}
        editMode={editMode}
        goToRoot={goToRoot}
        modalOpen={modalOpen}
        dirtyBlocks={dirtyBlocks}
        setStep={this.updateStep}
        closeModal={this.closeModal}
        reopenPanel={this.reopenPanel}
        urlProps={urlProps}
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
