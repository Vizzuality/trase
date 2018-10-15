import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import React from 'react';
import PropTypes from 'prop-types';
import DashboardElement from 'react-components/dashboard-element/dashboard-element.component';
import { getActiveIndicatorsData } from 'react-components/dashboard-element/dashboard-element.selectors';

const mapStateToProps = state => ({
  indicators: state.dashboardElement.data.indicators,
  activeIndicators: getActiveIndicatorsData(state)
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      goToRoot: () => ({ type: 'dashboardRoot' })
    },
    dispatch
  );

class DashboardElementContainer extends React.Component {
  static propTypes = {
    goToRoot: PropTypes.func.isRequired,
    activeIndicators: PropTypes.array
  };

  hasVisitedBefore = {
    key: 'TRASE__HAS_VISITED_DASHBOARDS_BEFORE',
    get() {
      return localStorage.getItem(this.key);
    },
    set(key) {
      return localStorage.setItem(this.key, key);
    }
  };

  state = {
    modalOpen: true,
    goBackOnCloseModal: true,
    step: this.hasVisitedBefore.get()
      ? DashboardElement.steps.PANEL
      : DashboardElement.steps.WELCOME
  };

  componentDidMount() {
    if (!this.hasVisitedBefore.get()) {
      this.hasVisitedBefore.set(Date.now());
    }
  }

  closeModal = () => {
    this.setState({ modalOpen: false });
  };

  openPanel = step => {
    this.setState({ modalOpen: true, step });
  };

  updateStep = step => this.setState({ step });

  render() {
    const { step, modalOpen, goBackOnCloseModal } = this.state;
    const { goToRoot, activeIndicators } = this.props;
    return (
      <DashboardElement
        step={step}
        goToRoot={goToRoot}
        modalOpen={modalOpen}
        setStep={this.updateStep}
        closeModal={this.closeModal}
        goBackOnCloseModal={goBackOnCloseModal}
        activeIndicators={activeIndicators}
        openPanel={this.openPanel}
      />
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DashboardElementContainer);
