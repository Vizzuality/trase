import React from 'react';
import PropTypes from 'prop-types';

function DashboardWelcome(props) {
  const { onContinue } = props;
  return (
    <div className="c-dashboard-welcome">
      <h2 className="title -medium -light -center">Welcome to the Dashboard</h2>
      <div className="dashboard-welcome-card-container">
        <div className="dashboard-welcome-card">
          <h3>Single or multiple choices</h3>
          <p>Choose the options your are interested in, it is not necessary to select from every section.</p>
          <img src="/images/dashboards/icon_welcome_01.png" alt="single or multiple choices"/>
        </div>
        <div className="dashboard-welcome-card">
          <h3>Countries and beyond</h3>
          <p>Explore Sourcing Countries and their municipalities, biomes, states or ports.</p>
          <img src="/images/dashboards/icon_welcome_02.png" alt="countries and beyond" />
        </div>
        <div className="dashboard-welcome-card">
          <h3>Related options</h3>
          <p>Once the first choice has been made, you will be able to select from related options only.</p>
          <img src="/images/dashboards/icon_welcome_03.png" alt="related options" />
        </div>
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
