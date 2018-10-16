import React from 'react';
import PropTypes from 'prop-types';
import SimpleModal from 'react-components/shared/simple-modal.component';
import DashboardPanel from 'react-components/dashboard-element/dashboard-panel/dashboard-panel.container';
import DashboardWelcome from 'react-components/dashboard-element/dashboard-welcome.component';
import DashboardIndicators from 'react-components/dashboard-element/dashboard-indicators/dashboard-indicators.container';
import DashboardWiget from 'react-components/dashboard-element/dashboard-widget/dashboard-widget.container';

class DashboardElement extends React.PureComponent {
  static propTypes = {
    activeIndicators: PropTypes.array,
    step: PropTypes.number.isRequired,
    setStep: PropTypes.func.isRequired,
    openPanel: PropTypes.func.isRequired,
    goToRoot: PropTypes.func.isRequired,
    modalOpen: PropTypes.bool.isRequired,
    closeModal: PropTypes.func.isRequired,
    goBackOnCloseModal: PropTypes.bool.isRequired
  };

  static steps = {
    WELCOME: 0,
    PANEL: 1,
    INDICATORS: 2
  };

  renderDashboardModal() {
    const { step, setStep, goToRoot, modalOpen, closeModal, goBackOnCloseModal } = this.props;
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
                <span>close</span>
                <svg className="icon icon-close">
                  <use xlinkHref="#icon-close" />
                </svg>
              </button>
            </div>
            {step === DashboardElement.steps.WELCOME && (
              <DashboardWelcome onContinue={() => setStep(DashboardElement.steps.PANEL)} />
            )}
            {step === DashboardElement.steps.PANEL && (
              <DashboardPanel onContinue={() => setStep(DashboardElement.steps.INDICATORS)} />
            )}
            {step === DashboardElement.steps.INDICATORS && (
              <DashboardIndicators
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
    const { modalOpen, activeIndicators, openPanel } = this.props;
    return (
      <div className="l-dashboard-element">
        <div className="c-dashboard-element">
          <section className="dashboard-element-header">
            <div className="row">
              <div className="column small-12">
                <h2 className="dashboard-element-title">Dashboard</h2>
              </div>
            </div>
            <div className="row">
              <div className="column small-12 medium-6">
                <div className="dashboard-header-actions">
                  <button
                    type="button"
                    className="c-button -gray -medium dashboard-header-action -panel"
                    onClick={() => openPanel(DashboardElement.steps.PANEL)}
                  >
                    Edit Options
                  </button>
                  <button
                    type="button"
                    className="c-button -gray -medium dashboard-header-action -panel"
                    onClick={() => openPanel(DashboardElement.steps.INDICATORS)}
                  >
                    Edit Indicators
                  </button>
                </div>
              </div>
              <div className="column small-12 medium-6">
                <div className="dashboard-header-actions -end">
                  <a href="/" className="dashboard-header-action -link">
                    SHARE
                  </a>
                  <a href="/" className="dashboard-header-action -link">
                    DOWNLOAD
                  </a>
                </div>
              </div>
            </div>
          </section>
          {this.renderDashboardModal()}
          {modalOpen === false && (
            <section className="dashboard-element-widgets">
              <div className="row -equal-height -flex-end">
                {activeIndicators.map(indicator => (
                  <div key={indicator.id} className="column small-12 medium-6 ">
                    <DashboardWiget
                      url={indicator.url}
                      title={indicator.displayName}
                      chartType={indicator.chartType}
                    />
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    );
  }
}

export default DashboardElement;
