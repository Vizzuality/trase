import React from 'react';
import Heading from 'react-components/shared/heading';
import 'react-components/tool/tool-modal/context-modal/context-modal.scss';

function ContextModal() {
  // Replace this component with a copy of the dashboard panel modal
  return (
    <div className="c-context-modal">
      <div className="row columns">
        <div className="context-modal-content">
          <Heading size="md" className="modal-title">
            Choose the step you want to edit
          </Heading>
        </div>
      </div>
    </div>
  );
}

export default ContextModal;
