import React from 'react';
import PropTypes from 'prop-types';

function DashboardsWelcome(props) {
  const { onContinue } = props;
  return (
    <div className="c-dashboards-welcome">
      <h2 className="title -medium -light -center">Welcome to the Dashboard</h2>
      <div className="dashboards-welcome-card-container">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="dashboards-welcome-card" />
        ))}
      </div>
      <div className="dashboards-welcome-button-container">
        <button className="c-button -pink -large" onClick={onContinue}>
          Continue
        </button>
      </div>
    </div>
  );
}

DashboardsWelcome.propTypes = {
  onContinue: PropTypes.func.isRequired
};

export default DashboardsWelcome;
