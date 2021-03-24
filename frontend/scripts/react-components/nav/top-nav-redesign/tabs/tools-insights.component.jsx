import React, { useState, useMemo } from 'react';
import { Trail } from 'react-spring/renderprops';
import { NavLink } from 'redux-first-router-link';
import Icon from 'react-components/shared/icon';
import isMobile from 'utils/isMobile';

import InsightsCard from '../cards/insights-card.component';

const ToolsInsights = () => {
  const [activeCard, setActiveCard] = useState(null);
  const mobile = useMemo(() => isMobile());
  const cards = [
    {
      key: 0,
      properties: {
        title: 'Supply chains',
        summary:
          'Volutpat maecenas volutpat blandit aliquam etiam erat velit scelerisque. In ornare quam viverra orci',
        imageUrl: 'images/landing-redesign/supply-chain-blue.png'
      }
    },
    {
      key: 1,
      properties: {
        title: 'Finance',
        summary:
          'Volutpat maecenas volutpat blandit aliquam etiam erat velit scelerisque. In ornare quam viverra orci',
        imageUrl: 'images/landing-redesign/finance-blue.png'
      }
    },
    {
      key: 2,
      properties: {
        title: 'Insights',
        summary:
          'Volutpat maecenas volutpat blandit aliquam etiam erat velit scelerisque. In ornare quam viverra orci',
        imageUrl: 'images/landing-redesign/insights-blue.png'
      }
    }
  ];

  return (
    <div className="nav-tab-container -insights">
      <div className="-navigation-block">
        <ul className="sites-menu">
          <li>
            <a href="https://trase.earth" rel="noopener noreferrer" className="sites-menu-link">
              Home
            </a>
          </li>
          <li>
            <NavLink
              exact
              strict
              to={{ type: 'home' }}
              className="sites-menu-link"
              onMouseOver={() => setActiveCard(0)}
              onFocus={() => setActiveCard(0)}
              onMouseLeave={() => setActiveCard(null)}
            >
              Supply Chains
            </NavLink>
          </li>
          <li>
            <a
              href="https://trase.finance/"
              className="sites-menu-link"
              onMouseOver={() => setActiveCard(1)}
              onFocus={() => setActiveCard(1)}
              onMouseLeave={() => setActiveCard(null)}
            >
              Finance
            </a>
          </li>
          <li>
            <a
              href="https://insights.trase.earth"
              className="sites-menu-link"
              onMouseOver={() => setActiveCard(2)}
              onFocus={() => setActiveCard(2)}
              onMouseLeave={() => setActiveCard(null)}
            >
              Insights
            </a>
          </li>
        </ul>
        {!mobile && (
          <span className="scroll-indicator">
            <span>scroll</span>
            <Icon icon="icon-scroll-arrow" />
          </span>
        )}
        <ul className="about-menu">
          <li className="about-menu-item">
            <NavLink exact strict to={{ type: 'about' }}>
              About
            </NavLink>
          </li>
        </ul>
      </div>
      {!mobile && (
        <div className="-tab-contents">
          <div className="tab-contents-cards">
            <Trail
              items={cards}
              keys={item => item.key}
              from={{ transform: 'translate3d(0,-400px,0)' }}
              to={{ transform: 'translate3d(0,0px,0)' }}
            >
              {item => props => (
                <InsightsCard
                  trailStyles={props}
                  {...item.properties}
                  active={activeCard === item.key}
                />
              )}
            </Trail>
          </div>
        </div>
      )}
    </div>
  );
};

ToolsInsights.propTypes = {};

export default ToolsInsights;
