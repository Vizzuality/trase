import React from 'react';
import PropTypes from 'prop-types';
import SimpleModal from 'react-components/shared/simple-modal/simple-modal.component';
import DashboardPanel from 'react-components/dashboard-element/dashboard-panel/dashboard-panel.container';
import DashboardWelcome from 'react-components/dashboard-element/dashboard-welcome/dashboard-welcome.component';
import DashboardIndicators from 'react-components/dashboard-element/dashboard-indicators/dashboard-indicators.container';
import DashboardWiget from 'react-components/dashboard-element/dashboard-widget/dashboard-widget.container';
import Button from 'react-components/shared/button/button.component';

import 'react-components/dashboard-element/dashboard-element.scss';

class DashboardElement extends React.PureComponent {
  static propTypes = {
    dirtyBlocks: PropTypes.object,
    activeIndicators: PropTypes.array,
    step: PropTypes.number.isRequired,
    setStep: PropTypes.func.isRequired,
    editMode: PropTypes.bool.isRequired,
    reopenPanel: PropTypes.func.isRequired,
    goToRoot: PropTypes.func.isRequired,
    modalOpen: PropTypes.bool.isRequired,
    closeModal: PropTypes.func.isRequired,
    dynamicSentenceParts: PropTypes.array
  };

  static steps = {
    WELCOME: 0,
    PANEL: 1,
    INDICATORS: 2
  };

  renderDashboardModal() {
    const {
      step,
      setStep,
      editMode,
      goToRoot,
      modalOpen,
      closeModal,
      activeIndicators,
      dirtyBlocks
    } = this.props;
    const hasIndicators = activeIndicators.length > 0;
    const hasOptionsSelected = Object.values(dirtyBlocks).some(b => b);
    const canProceed = hasOptionsSelected && hasIndicators;
    const onClose = editMode && canProceed ? closeModal : goToRoot;

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
              <DashboardPanel
                editMode={editMode}
                onContinue={() =>
                  editMode && canProceed ? closeModal() : setStep(DashboardElement.steps.INDICATORS)
                }
              />
            )}
            {step === DashboardElement.steps.INDICATORS && (
              <DashboardIndicators
                editMode={editMode}
                onContinue={closeModal}
                goBack={() => setStep(DashboardElement.steps.PANEL)}
              />
            )}
          </div>
        </SimpleModal>
      </React.Fragment>
    );
  }

  renderDynamicSentence() {
    const { dynamicSentenceParts } = this.props;

    if (dynamicSentenceParts) {
      return dynamicSentenceParts.map((part, i) => (
        <React.Fragment key={part.prefix + part.value + i}>
          {`${part.prefix} `}
          {part.value && (
            <span className="dashboard-element-title-item notranslate">{part.value}</span>
          )}
        </React.Fragment>
      ));
    }

    return 'Dashboards';
  }

  renderWidgets() {
    const { activeIndicators } = this.props;
    return (
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
    );
  }

  render() {
    const { modalOpen, activeIndicators, reopenPanel, goToRoot, dirtyBlocks = {} } = this.props;
    const hasIndicators = activeIndicators.length > 0;
    const hasOptionsSelected = Object.values(dirtyBlocks).some(b => b);
    const canProceed = hasOptionsSelected && hasIndicators;
    return (
      <div className="l-dashboard-element">
        <div className="c-dashboard-element">
          <section className="dashboard-element-header">
            <div className="row">
              <div className="column small-12">
                <h2 className="dashboard-element-title">{this.renderDynamicSentence()}</h2>
              </div>
            </div>
            <div className="row">
              <div className="column small-12 medium-6">
                <div className="dashboard-header-actions">
                  <Button
                    type="button"
                    color="gray"
                    size="sm"
                    className="dashboard-header-action -panel"
                    onClick={() => reopenPanel(DashboardElement.steps.PANEL, canProceed)}
                  >
                    Edit Options
                  </Button>
                  <Button
                    type="button"
                    color="gray-transparent"
                    size="sm"
                    className="dashboard-header-action -panel"
                    onClick={() => reopenPanel(DashboardElement.steps.INDICATORS, canProceed)}
                  >
                    Edit Indicators
                  </Button>
                </div>
              </div>
              <div className="column small-12 medium-6">
                <div className="dashboard-header-actions -end">
                  <button
                    className="dashboard-header-action -link"
                    onClick={() => alert('coming soon')}
                  >
                    <svg className="icon icon-download">
                      <use xlinkHref="#icon-download" />
                    </svg>
                    DOWNLOAD
                  </button>
                  <button
                    className="dashboard-header-action -link"
                    onClick={() => alert('coming soon')}
                  >
                    <svg className="icon icon-share">
                      <use xlinkHref="#icon-share" />
                    </svg>
                    SHARE
                  </button>
                </div>
              </div>
            </div>
          </section>
          {this.renderDashboardModal()}
          {modalOpen === false && (
            <section className="dashboard-element-widgets">
              {canProceed ? (
                this.renderWidgets()
              ) : (
                <div className="row align-center">
                  <div className="column small-6">
                    <div className="dashboard-element-fallback">
                      <p className="dashboard-element-title dashboard-element-fallback-text">
                        Your dashboard has no selection.
                      </p>
                      <Button
                        color="gray-transparent"
                        size="medium"
                        className="dashboard-element-fallback-button"
                        onClick={goToRoot}
                      >
                        Go Back
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </section>
          )}
        </div>
      </div>
    );
  }
}

export default DashboardElement;
