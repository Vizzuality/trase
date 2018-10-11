import React from 'react';
import PropTypes from 'prop-types';

function DashboardWelcome(props) {
  const { onContinue } = props;
  return (
    <div className="c-dashboard-welcome">
      <h2 className="title -medium -light -center">Welcome to the Dashboard</h2>
      <div className="dashboard-welcome-card-container">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="dashboard-welcome-card" />
        ))}
      </div>
      <div className="dashboard-welcome-button-container">
        <button className="c-button -pink -large" onClick={onContinue}>
          Continue
        </button>
      </div>
    </div>
  );
}

DashboardWelcome.propTypes = {
  onContinue: PropTypes.func.isRequired
};

export default DashboardWelcome;
