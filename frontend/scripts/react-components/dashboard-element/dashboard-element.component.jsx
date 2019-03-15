import React from 'react';
import PropTypes from 'prop-types';
import SimpleModal from 'react-components/shared/simple-modal/simple-modal.component';
import DashboardPanel from 'react-components/dashboard-element/dashboard-panel';
import DashboardWelcome from 'react-components/dashboard-element/dashboard-welcome/dashboard-welcome.component';
import DashboardIndicators from 'react-components/dashboard-element/dashboard-indicators/dashboard-indicators.container';
import DashboardWidget from 'react-components/dashboard-element/dashboard-widget/dashboard-widget.container';
import Button from 'react-components/shared/button/button.component';
import Dropdown from 'react-components/shared/dropdown';

import 'react-components/dashboard-element/dashboard-element.scss';
import { DASHBOARD_STEPS } from 'constants';

class DashboardElement extends React.PureComponent {
  static propTypes = {
    activeIndicators: PropTypes.array,
    step: PropTypes.number.isRequired,
    setStep: PropTypes.func.isRequired,
    editMode: PropTypes.bool.isRequired,
    goToRoot: PropTypes.func.isRequired,
    modalOpen: PropTypes.bool.isRequired,
    closeModal: PropTypes.func.isRequired,
    dynamicSentenceParts: PropTypes.array,
    reopenPanel: PropTypes.func.isRequired
  };

  renderStep() {
    const { step, setStep, editMode, closeModal } = this.props;
    const showBackButton = step > DASHBOARD_STEPS.sources;
    if (step === DASHBOARD_STEPS.welcome) {
      return <DashboardWelcome onContinue={() => setStep(step + 1)} />;
    }
    if (step === DASHBOARD_STEPS.indicators) {
      return (
        <DashboardIndicators
          editMode={editMode}
          onContinue={closeModal}
          goBack={() => setStep(DASHBOARD_STEPS.sources)}
          step={step}
        />
      );
    }
    return (
      <DashboardPanel
        editMode={editMode}
        onContinue={() => setStep(step + 1)}
        step={step}
        onBack={showBackButton ? () => setStep(step - 1) : undefined}
      />
    );
  }

  renderDashboardModal() {
    const { editMode, goToRoot, modalOpen, closeModal } = this.props;
    const onClose = editMode ? closeModal : goToRoot;
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
        <SimpleModal isOpen={modalOpen} onRequestClose={onClose}>
          {this.renderStep()}
        </SimpleModal>
      </React.Fragment>
    );
  }

  renderDynamicSentence() {
    const { dynamicSentenceParts } = this.props;
    if (dynamicSentenceParts) {
      return dynamicSentenceParts.map((part, i) => (
        <span key={part.id + i}>
          {`${part.prefix} `}
          {part.value && (
            <span className="dashboard-element-title-item notranslate">
              {part.value.length > 1 ? (
                <Dropdown
                  variant="sentence"
                  color="white"
                  options={part.value.map(p => ({ value: p.id, label: p.name }))}
                  selectedValueOverride={`${part.value.length} ${part.panel}`}
                  readOnly
                  showSelected
                />
              ) : (
                part.value[0].name
              )}
            </span>
          )}
        </span>
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
            <DashboardWidget
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
    const { modalOpen, reopenPanel, goToRoot, activeIndicators } = this.props;
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
                    onClick={() => reopenPanel(DASHBOARD_STEPS.sources)}
                  >
                    Edit Options
                  </Button>
                  <Button
                    type="button"
                    color="gray-transparent"
                    size="sm"
                    className="dashboard-header-action -panel"
                    onClick={() => reopenPanel(DASHBOARD_STEPS.indicators)}
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
              {activeIndicators.length > 0 ? (
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
