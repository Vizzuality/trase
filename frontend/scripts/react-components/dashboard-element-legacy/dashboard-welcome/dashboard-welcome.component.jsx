import React from 'react';
import PropTypes from 'prop-types';
import Button from 'react-components/shared/button/button.component';
import Heading from 'react-components/shared/heading/heading.component';
import { ImgBackground } from 'react-components/shared/img';

import './dashboard-welcome.scss';

function DashboardWelcome(props) {
  const { onContinue } = props;
  const cards = [
    {
      title: 'Single or multiple choices',
      body:
        "Depending on the step, you can select one or more options. You don't need to select an item from every category to create your dashboard.",
      image: '/images/dashboards/icon_welcome_01.png'
    },
    {
      title: 'More options',
      body:
        'Within source countries, you will be able to select from sub-categories such as biomes or states where data is available.',
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
      <div className="row align-center">
        {cards.map(card => (
          <div className="column small-12 medium-6 large-4" key={card.title}>
            <div className="dashboard-welcome-card">
              <Heading size="md" weight="bold" className="dashboard-welcome-card-title">
                {card.title}
              </Heading>
              <div className="dashboard-welcome-card-container">
                <p className="dashboard-welcome-card-text">{card.body}</p>
                <ImgBackground className="dashboard-welcome-card-image" src={card.image} />
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="dashboard-welcome-footer">
        <div className="dashboard-welcome-button-container">
          <Button size="md" color="pink" onClick={onContinue} testId="dashboard-welcome-button">
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
}

DashboardWelcome.propTypes = {
  onContinue: PropTypes.func.isRequired
};

export default DashboardWelcome;
