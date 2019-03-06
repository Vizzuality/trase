import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import React from 'react';
import PropTypes from 'prop-types';
import DashboardElement from 'react-components/dashboard-element/dashboard-element.component';
import {
  getActiveIndicatorsData,
  getDirtyBlocks,
  getDynamicSentence,
  getDashboardPanelTabs
} from 'react-components/dashboard-element/dashboard-element.selectors';
import { getPanelId, singularize } from 'utils/dashboardPanel';
import {
  openIndicatorsStep as openIndicatorsStepFn,
  setDashboardActivePanel as setDashboardActivePanelFn,
  setDashboardPanelActiveTab as setDashboardPanelActiveTabFn
} from 'react-components/dashboard-element/dashboard-element.actions';
import { DASHBOARD_STEPS } from 'constants';

const mapStateToProps = state => ({
  indicators: state.dashboardElement.data.indicators,
  activeIndicators: getActiveIndicatorsData(state),
  dynamicSentenceParts: getDynamicSentence(state),
  dirtyBlocks: getDirtyBlocks(state),
  tabs: getDashboardPanelTabs(state)
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      setDashboardPanelActiveTab: setDashboardPanelActiveTabFn,
      setDashboardActivePanel: setDashboardActivePanelFn,
      openIndicatorsStep: openIndicatorsStepFn,
      goToRoot: () => ({ type: 'dashboardRoot' })
    },
    dispatch
  );

class DashboardElementContainer extends React.Component {
  static propTypes = {
    dirtyBlocks: PropTypes.object,
    activeIndicators: PropTypes.array,
    goToRoot: PropTypes.func.isRequired,
    dynamicSentenceParts: PropTypes.array,
    tabs: PropTypes.object,
    openIndicatorsStep: PropTypes.func.isRequired,
    setDashboardActivePanel: PropTypes.func.isRequired,
    setDashboardPanelActiveTab: PropTypes.func.isRequired
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
    step: this.hasVisitedBefore.get() ? DASHBOARD_STEPS.PANEL : DASHBOARD_STEPS.WELCOME
  };

  componentDidMount() {
    if (!this.hasVisitedBefore.get()) {
      this.hasVisitedBefore.set(Date.now());
    }
  }

  closeModal = () => {
    this.setState({ modalOpen: false });
  };

  reopenPanel = (step, editMode) => this.setState({ step, editMode, modalOpen: true });

  updateStep = step => {
    const {
      setDashboardActivePanel,
      setDashboardPanelActiveTab,
      tabs,
      openIndicatorsStep
    } = this.props;
    if (step !== DASHBOARD_STEPS.INDICATORS) {
      let panelId = getPanelId(step);
      // TODO: This should be a temporary solution. We may want to create importer and exporter panels in the state
      if (panelId === 'exporters' || panelId === 'importers') {
        const tabName = singularize(panelId).toUpperCase();
        const selectedTab = tabs.companies.find(t => t.name === tabName);
        setDashboardPanelActiveTab(selectedTab, 'companies');
        panelId = 'companies';
      }
      setDashboardActivePanel(panelId);
    } else {
      openIndicatorsStep();
    }
    this.setState({ step });
  };

  render() {
    const { step, modalOpen, editMode } = this.state;
    const {
      goToRoot,
      activeIndicators,
      dynamicSentenceParts,
      dirtyBlocks,
      openIndicatorsStep
    } = this.props;
    return (
      <DashboardElement
        step={step}
        editMode={editMode}
        goToRoot={goToRoot}
        modalOpen={modalOpen}
        dirtyBlocks={dirtyBlocks}
        setStep={this.updateStep}
        closeModal={this.closeModal}
        reopenPanel={this.reopenPanel}
        activeIndicators={activeIndicators}
        openIndicatorsStep={openIndicatorsStep}
        dynamicSentenceParts={dynamicSentenceParts}
      />
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DashboardElementContainer);
