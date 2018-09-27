import React from 'react';
import PropTypes from 'prop-types';
import SimpleModal from 'react-components/shared/simple-modal.component';
import Panel from 'react-components/dashboard-element/dashboard-panel/dashboard-panel.container';
import DashboardWelcome from 'react-components/dashboard-element/dashboard-welcome.component';
import DashboardIndicators from 'react-components/dashboard-element/dashboard-indicators/dashboard-indicators.container';
import WidgetHeader from 'react-components/dashboard-element/widget-header.component';
// import cx from 'classnames';

class DashboardElement extends React.PureComponent {
  renderDashboardModal() {
    const {
      step,
      setStep,
      goToRoot,
      modalOpen,
      closeModal,
      dynamicSentenceParts,
      goBackOnCloseModal
    } = this.props;
    const onClose = goBackOnCloseModal ? goToRoot : closeModal;

    return (
      <React.Fragment>
        {modalOpen && (
          <section className="dashboard-element-placeholder">
            <div className="row">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="column small-12 medium-6">
                  <b className="dashboard-element-placeholder-item" />
                </div>
              ))}
            </div>
          </section>
        )}
        <SimpleModal isOpen={modalOpen} onRequestClose={onClose} className="no-events">
          <div className="dashboard-modal-content all-events">
            <div className="dashboard-modal-close">
              <button onClick={onClose}>
                <svg className="icon icon-close">
                  <use xlinkHref="#icon-close" />
                </svg>
              </button>
            </div>
            {step === DashboardElement.steps.WELCOME && (
              <DashboardWelcome onContinue={() => setStep(DashboardElement.steps.PANEL)} />
            )}
            {step === DashboardElement.steps.PANEL && (
              <Panel
                onContinue={() => setStep(DashboardElement.steps.INDICATORS)}
                dynamicSentenceParts={dynamicSentenceParts}
              />
            )}
            {step === DashboardElement.steps.INDICATORS && (
              <DashboardIndicators
                dynamicSentenceParts={dynamicSentenceParts}
                onContinue={closeModal}
                goBack={() => setStep(DashboardElement.steps.PANEL)}
              />
            )}
          </div>
        </SimpleModal>
      </React.Fragment>
    );
  }

  render() {
    const { modalOpen } = this.props;
    return (
      <div className="l-dashboard-element">
        <div className="c-dashboard-element">
          <section className="dashboard-element-header">
            <div className="row">
              <div className="column small-12">
                <h2 className="dashboard-element-title">Dashboard</h2>
              </div>
            </div>
          </section>
          {this.renderDashboardModal()}
          {modalOpen === false && (
            <section className="dashboard-element-widgets">
              <div className="row">
                <div className="column small-12 medium-6">
                  <WidgetHeader title="Max deforestation by exporter" />
                  <div className="dashboard-element-widgets-item">

                  </div>
                </div>
              </div>
            </section>
          )}
        </div>
      </div>
    );
  }
}

DashboardElement.propTypes = {
  step: PropTypes.number.isRequired,
  setStep: PropTypes.func.isRequired,
  goToRoot: PropTypes.func.isRequired,
  modalOpen: PropTypes.bool.isRequired,
  dynamicSentenceParts: PropTypes.array,
  closeModal: PropTypes.func.isRequired,
  goBackOnCloseModal: PropTypes.bool.isRequired
};

DashboardElement.steps = {
  WELCOME: 0,
  PANEL: 1,
  INDICATORS: 2
};

export default DashboardElement;
