import React from 'react';
import PropTypes from 'prop-types';
import Button from 'react-components/shared/button/button.component';
import Heading from 'react-components/shared/heading/heading.component';

import './dashboard-welcome.scss';

function DashboardWelcome(props) {
  const { onContinue } = props;
  const cards = [
    {
      title: 'Single or multiple choices',
      body:
        "Select one or more options in the categories you are interested in. You don't need to select an item from every category to create your dashboard.",
      image: '/images/dashboards/icon_welcome_01.png'
    },
    {
      title: 'More options',
      body:
        'Within each category you will be able to select from sub-categories where data is available. For example, select a country in "regions of production" and you will be presented with sub-national levels of governance, such as biomes or states, to select if you want to.',
      image: '/images/dashboards/icon_welcome_02.png'
    },
    {
      title: 'Filtering',
      body:
        'Once the first selection has been made, you will be able to select from remaining options available for that selection only.',
      image: '/images/dashboards/icon_welcome_03.png'
    }
  ];
  return (
    <div className="c-dashboard-welcome">
      <Heading size="lg" align="center">
        Welcome to your dashboard
      </Heading>
      <div className="dashboard-welcome-container">
        {cards.map(card => (
          <div className="dashboard-welcome-card" key={card.title}>
            <h3 className="dashboard-welcome-card-title">{card.title}</h3>
            <div className="dashboard-welcome-card-container">
              <p className="dashboard-welcome-card-text">{card.body}</p>
              <div
                className="dashboard-welcome-card-image"
                style={{ backgroundImage: `url(${card.image})` }}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="dashboard-welcome-button-container">
        <Button size="md" color="pink" onClick={onContinue}>
          Continue
        </Button>
      </div>
    </div>
  );
}

DashboardWelcome.propTypes = {
  onContinue: PropTypes.func.isRequired
};

export default DashboardWelcome;
