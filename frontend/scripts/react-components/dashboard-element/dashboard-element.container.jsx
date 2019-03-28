import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import React from 'react';
import PropTypes from 'prop-types';
import DashboardElement from 'react-components/dashboard-element/dashboard-element.component';
import {
  getDirtyBlocks,
  getDynamicSentence,
  getDashboardFiltersProps
} from 'react-components/dashboard-element/dashboard-element.selectors';
import { getPanelId } from 'utils/dashboardPanel';
import {
  setDashboardSelectedYears,
  setDashboardSelectedResizeBy,
  setDashboardSelectedRecolorBy,
  setDashboardActivePanel as setDashboardActivePanelFn
} from 'react-components/dashboard-element/dashboard-element.actions';
import { DASHBOARD_STEPS } from 'constants';

const mapStateToProps = state => ({
  dirtyBlocks: getDirtyBlocks(state),
  charts: state.dashboardElement.charts,
  filters: getDashboardFiltersProps(state),
  dynamicSentenceParts: getDynamicSentence(state)
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      goToRoot: () => ({ type: 'dashboardRoot' }),
      setSelectedYears: setDashboardSelectedYears,
      setSelectedResizeBy: setDashboardSelectedResizeBy,
      setDashboardActivePanel: setDashboardActivePanelFn,
      setSelectedRecolorBy: setDashboardSelectedRecolorBy
    },
    dispatch
  );

class DashboardElementContainer extends React.Component {
  static propTypes = {
    charts: PropTypes.array,
    filters: PropTypes.object,
    dirtyBlocks: PropTypes.object,
    goToRoot: PropTypes.func.isRequired,
    dynamicSentenceParts: PropTypes.array,
    setSelectedYears: PropTypes.func.isRequired,
    setSelectedResizeBy: PropTypes.func.isRequired,
    setSelectedRecolorBy: PropTypes.func.isRequired,
    setDashboardActivePanel: PropTypes.func.isRequired
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
    modalOpen: true,
    editMode: false,
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
      if (step !== DASHBOARD_STEPS.indicators) {
        setDashboardActivePanel(getPanelId(step));
      }
    }
  }

  closeModal = () => {
    this.setState({ modalOpen: false });
  };

  reopenPanel = step => this.setState({ step, editMode: true, modalOpen: true });

  updateStep = step => this.setState({ step });

  render() {
    const { step, modalOpen, editMode } = this.state;
    const {
      charts,
      goToRoot,
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
        charts={charts}
        filters={filters}
        editMode={editMode}
        goToRoot={goToRoot}
        modalOpen={modalOpen}
        dirtyBlocks={dirtyBlocks}
        setStep={this.updateStep}
        closeModal={this.closeModal}
        reopenPanel={this.reopenPanel}
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
