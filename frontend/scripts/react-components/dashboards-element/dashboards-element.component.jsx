import React from 'react';
import PropTypes from 'prop-types';
import SimpleModal from 'react-components/shared/simple-modal.component';
import Panel from 'react-components/dashboards-element/dashboards-panel/dashboards-panel.container';
import DashboardsWelcome from 'react-components/dashboards-element/dashboards-welcome.component';
// import cx from 'classnames';

function DashboardsElement(props) {
  const { step, setStep } = props;
  return (
    <div className="l-dashboards-element">
      <div className="c-dashboards-element">
        <div className="row column">
          <h2 className="dashboards-element-title">Dashboard</h2>
        </div>
        <section className="dashboards-element-placeholder">
          <div className="row">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="column small-12 medium-6">
                <b className="dashboards-element-placeholder-item" />
              </div>
            ))}
          </div>
        </section>
        <SimpleModal isOpen>
          <div className="row align-center">
            <div className="column small-12 medium-11">
              <div className="dashboards-modal-content">
                <div className="dashboards-modal-close">
                  <button>
                    <svg className="icon icon-close">
                      <use xlinkHref="#icon-close" />
                    </svg>
                  </button>
                </div>
                {step === 0 && <DashboardsWelcome onContinue={() => setStep(1)} />}
                {step === 1 && <Panel />}
              </div>
            </div>
          </div>
        </SimpleModal>
      </div>
    </div>
  );
}

DashboardsElement.propTypes = {
  step: PropTypes.number,
  setStep: PropTypes.func
};

export default DashboardsElement;
