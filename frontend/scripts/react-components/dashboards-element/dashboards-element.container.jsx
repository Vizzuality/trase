import React from 'react';
import DashboardsElement from 'react-components/dashboards-element/dashboards-element.component';

class DashboardsElementContainer extends React.Component {
  state = {
    step: 0,
    modalOpen: true,
    canCloseModal: false
  };

  closeModal = () => {
    console.log('hehehehehe');
    if (this.state.canCloseModal) {
      this.setState({ modalOpen: false });
    }
  };

  setCanCloseModal = canClose => {
    this.setState({ canCloseModal: canClose });
  };

  updateStep = step => this.setState({ step });

  render() {
    const { step, modalOpen, canCloseModal } = this.state;
    return (
      <DashboardsElement
        step={step}
        modalOpen={modalOpen}
        setStep={this.updateStep}
        closeModal={this.closeModal}
        canCloseModal={canCloseModal}
        setCanCloseModal={this.setCanCloseModal}
      />
    );
  }
}

export default DashboardsElementContainer;
