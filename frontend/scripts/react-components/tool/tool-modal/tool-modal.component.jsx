import React, { useState } from 'react';
import PropTypes from 'prop-types';
import BaseModal from 'react-components/tool/tool-modal/base-modal';
import DashboardPanel from 'react-components/dashboard-element/dashboard-panel';
import LayerModal from 'react-components/tool/tool-modal/layer-modal';
import VersioningModal from 'react-components/tool/tool-modal/versioning-modal';
import SimpleModal from 'react-components/shared/simple-modal/simple-modal.component';
import 'react-components/tool/tool-modal/tool-modal.scss';
import { TOOL_STEPS } from 'constants';

export default function ToolModal(props) {
  const { items, selectedItem, onChange, activeModal, setActiveModal, savePanels } = props;
  const [step, setStep] = useState(TOOL_STEPS.welcome);

  if (!activeModal) {
    return null;
  }

  const getModalComponent = () => {
    switch (activeModal) {
      case 'context': {
        const closeModal = () => setActiveModal(null);
        const showBackButton = step > TOOL_STEPS.sources;
        const onContinue = () => {
          if (step === TOOL_STEPS.importers) {
            savePanels();
            closeModal();
          } else {
            setStep(step + 1);
          }
        };

        return (
          <DashboardPanel
            step={step}
            setStep={setStep}
            closeModal={closeModal}
            onContinue={onContinue}
            showBackButton={showBackButton}
            onBack={showBackButton ? () => setStep(step - 1) : undefined}
          />
        );
      }
      case 'layer':
        return <LayerModal />;
      case 'version':
        return <VersioningModal />;
      default:
        return (
          <BaseModal
            items={items}
            selectedItem={selectedItem}
            onChange={onChange}
            modalId={activeModal}
          />
        );
    }
  };

  return (
    <SimpleModal isOpen onRequestClose={() => setActiveModal(null)}>
      {getModalComponent()}
    </SimpleModal>
  );
}

ToolModal.propTypes = {
  items: PropTypes.array,
  activeModal: PropTypes.string,
  selectedItem: PropTypes.object,
  onChange: PropTypes.func.isRequired,
  savePanels: PropTypes.func.isRequired,
  setActiveModal: PropTypes.func.isRequired
};
