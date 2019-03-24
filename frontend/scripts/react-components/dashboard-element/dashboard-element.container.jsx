import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import React from 'react';
import PropTypes from 'prop-types';
import DashboardElement from 'react-components/dashboard-element/dashboard-element.component';
import {
  getDirtyBlocks,
  getDynamicSentence
} from 'react-components/dashboard-element/dashboard-element.selectors';
import { getPanelId } from 'utils/dashboardPanel';
import { setDashboardActivePanel as setDashboardActivePanelFn } from 'react-components/dashboard-element/dashboard-element.actions';
import { DASHBOARD_STEPS } from 'constants';

const mapStateToProps = state => ({
  dynamicSentenceParts: getDynamicSentence(state),
  dirtyBlocks: getDirtyBlocks(state)
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      setDashboardActivePanel: setDashboardActivePanelFn,
      goToRoot: () => ({ type: 'dashboardRoot' })
    },
    dispatch
  );

class DashboardElementContainer extends React.Component {
  static propTypes = {
    dirtyBlocks: PropTypes.object,
    goToRoot: PropTypes.func.isRequired,
    dynamicSentenceParts: PropTypes.array,
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
    const { goToRoot, dynamicSentenceParts, dirtyBlocks } = this.props;
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
        dynamicSentenceParts={dynamicSentenceParts}
      />
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DashboardElementContainer);
