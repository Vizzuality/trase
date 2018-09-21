import React from 'react';
import PropTypes from 'prop-types';
import SimpleModal from 'react-components/shared/simple-modal.component';
import Panel from 'react-components/dashboard-element/dashboard-panel/dashboard-panel.container';
import DashboardWelcome from 'react-components/dashboard-element/dashboard-welcome.component';
// import cx from 'classnames';

function DashboardElement(props) {
  const { step, setStep, modalOpen, closeModal } = props;
  return (
    <div className="l-dashboard-element">
      <div className="c-dashboard-element">
        <div className="row column">
          <h2 className="dashboard-element-title">Dashboard</h2>
        </div>
        <section className="dashboard-element-placeholder">
          <div className="row">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="column small-12 medium-6">
                <b className="dashboard-element-placeholder-item" />
              </div>
            ))}
          </div>
        </section>
        <SimpleModal isOpen={modalOpen} onRequestClose={closeModal} className="no-events">
          <div className="row align-center">
            <div className="column small-12 medium-11">
              <div className="dashboard-modal-content all-events">
                <div className="dashboard-modal-close">
                  <button onClick={closeModal}>
                    <svg className="icon icon-close">
                      <use xlinkHref="#icon-close" />
                    </svg>
                  </button>
                </div>
                {step === 0 && <DashboardWelcome onContinue={() => setStep(1)} />}
                {step === 1 && <Panel onContinue={() => setStep(2)} />}
              </div>
            </div>
          </div>
        </SimpleModal>
      </div>
    </div>
  );
}

DashboardElement.propTypes = {
  step: PropTypes.number.isRequired,
  setStep: PropTypes.func.isRequired,
  modalOpen: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired
};

export default DashboardElement;
