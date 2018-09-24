import React from 'react';
import PropTypes from 'prop-types';
import DashboardModalFooter from 'react-components/dashboard-element/dahsboard-modal-footer.component';

function DashboardIndicators(props) {
  const { dynamicSentenceParts } = props;
  return (
    <div className="c-dashboard-panel">
      <div className="dashboard-panel-content">
        <h2 className="dasboard-panel-title title -center -light">Indicators</h2>
      </div>
      <DashboardModalFooter dynamicSentenceParts={dynamicSentenceParts} />
    </div>
  );
}

DashboardIndicators.propTypes = {
  dynamicSentenceParts: PropTypes.array
};

export default DashboardIndicators;
