import React, { useState } from 'react';
import { Trail } from 'react-spring/renderprops';

import InsightsCard from '../cards/insights-card.component';

const ToolsInsights = () => {
  const [activeCard, setActiveCard] = useState(null);

  const cards = [
    {
      key: 0,
      properties: {
        title: 'Supply chain',
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
        <ul>
          <li>
            <a href="#">Home</a>
          </li>
          <li>
            <a
              href="#"
              onMouseOver={() => setActiveCard(0)}
              onMouseLeave={() => setActiveCard(null)}
            >
              Supply Chain
            </a>
          </li>
          <li>
            <a
              href="#"
              onMouseOver={() => setActiveCard(1)}
              onMouseLeave={() => setActiveCard(null)}
            >
              Finance
            </a>
          </li>
          <li>
            <a
              href="#"
              onMouseOver={() => setActiveCard(2)}
              onMouseLeave={() => setActiveCard(null)}
            >
              Insights
            </a>
          </li>
        </ul>
        <span className="scroll-indicator">scroll</span>
      </div>
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
    </div>
  );
};

ToolsInsights.propTypes = {};

export default ToolsInsights;
