import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import React from 'react';
import PropTypes from 'prop-types';
import DashboardElement from 'react-components/dashboard-element/dashboard-element.component';

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      goToRoot: () => ({ type: 'dashboardRoot' })
    },
    dispatch
  );

class DashboardElementContainer extends React.Component {
  static propTypes = {
    goToRoot: PropTypes.func.isRequired
  };

  state = {
    step: 0,
    goBackOnCloseModal: true,
    modalOpen: true
  };

  closeModal = () => {
    this.setState({ modalOpen: false });
    if (this.state.goBackOnCloseModal) {
      this.props.goToRoot();
    }
  };

  updateStep = step => this.setState({ step });

  render() {
    const { step, modalOpen } = this.state;
    return (
      <DashboardElement
        step={step}
        modalOpen={modalOpen}
        setStep={this.updateStep}
        closeModal={this.closeModal}
      />
    );
  }
}

export default connect(
  null,
  mapDispatchToProps
)(DashboardElementContainer);
