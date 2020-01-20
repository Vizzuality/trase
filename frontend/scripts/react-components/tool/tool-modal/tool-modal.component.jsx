import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ListModal from 'react-components/shared/list-modal';
import DashboardPanel from 'react-components/dashboard-element/dashboard-panel';
import LayerModal from 'react-components/tool/tool-modal/layer-modal';
import VersioningModal from 'react-components/tool/tool-modal/versioning-modal';
import SimpleModal from 'react-components/shared/simple-modal/simple-modal.component';
import { TOOL_STEPS } from 'constants';

import 'react-components/tool/tool-modal/tool-modal.scss';

export default function ToolModal(props) {
  const { items, selectedItem, onChange, activeModal, setActiveModal, finishSelection } = props;
  const [step, setStep] = useState(TOOL_STEPS.welcome);

  if (!activeModal) {
    return null;
  }

  const getModalComponent = () => {
    switch (activeModal) {
      case 'context': {
        const closeModal = () => setActiveModal(null);
        const showBackButton = step > TOOL_STEPS.sources;
        const onContinue = isLastStep => {
          if (isLastStep) {
            finishSelection();
            closeModal();
          } else {
            setStep(step + 1);
          }
        };

        return (
          <DashboardPanel
            step={step}
            setStep={setStep}
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
          <ListModal
            items={items}
            onChange={onChange}
            heading={activeModal === 'viewMode' ? 'Change view' : `Choose one ${activeModal}`}
            selectedItem={selectedItem}
            itemValueProp={activeModal === 'viewMode' ? 'value' : undefined}
          />
        );
    }
  };

  const closeLabel = activeModal === 'context' ? 'cancel' : 'close';
  return (
    <SimpleModal isOpen onRequestClose={() => setActiveModal(null)} closeLabel={closeLabel}>
      {getModalComponent()}
    </SimpleModal>
  );
}

ToolModal.propTypes = {
  items: PropTypes.array,
  onChange: PropTypes.func,
  activeModal: PropTypes.string,
  selectedItem: PropTypes.object,
  finishSelection: PropTypes.func.isRequired,
  setActiveModal: PropTypes.func.isRequired
};
