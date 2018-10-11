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

  state = {
    modalOpen: true,
    goBackOnCloseModal: true,
    step: DashboardElement.steps.WELCOME
  };

  closeModal = () => {
    this.setState({ modalOpen: false });
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
      />
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DashboardElementContainer);
