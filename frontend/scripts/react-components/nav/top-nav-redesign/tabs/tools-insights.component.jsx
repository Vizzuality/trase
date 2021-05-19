import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Trail } from 'react-spring/renderprops';
import { NavLink } from 'redux-first-router-link';
import isMobile from 'utils/isMobile';
import cx from 'classnames';
import InsightsCard from '../cards/insights-card.component';

const ToolsInsights = () => {
  const [activeCard, setActiveCard] = useState(null);
  const mobile = useMemo(() => isMobile());
  const cardsRef = useRef([]);

  useEffect(() => {
    if (
      !mobile &&
      (activeCard || activeCard === 0) &&
      cardsRef.current &&
      cardsRef.current[activeCard]
    ) {
      cardsRef.current[activeCard].scrollIntoView({ inline: 'center', behavior: 'smooth' });
    }
  }, [activeCard, cardsRef]);

  const cards = [
    {
      key: 0,
      properties: {
        title: 'Supply chain',
        url: '/',
        summary:
          'Explore the connections between production regions, trading companies and import markets. Understand exposure to deforestation and other environmental and social risks.',
        imageUrl: 'images/landing-redesign/supply-chain-blue.png'
      }
    },
    {
      key: 1,
      properties: {
        title: 'Finance',
        url: 'https://trase.finance',
        summary:
          'Explore direct and indirect exposure of the finance sector to deforestation and other risks. Uncover the ownership patterns of commodity trading companies.',
        imageUrl: 'images/landing-redesign/finance-blue.png'
      }
    },
    {
      key: 2,
      properties: {
        title: 'Insights',
        url: 'https://insights.trase.earth',
        summary:
          'Discover the latest insights and analysis on the sustainability of commodity trade by Trase’s team of experts and partners.',
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
              className={cx('sites-menu-link', { active: activeCard === 0 })}
              onMouseOver={() => setActiveCard(0)}
              onFocus={() => setActiveCard(0)}
              onMouseLeave={() => setActiveCard(null)}
            >
              Supply Chain
            </NavLink>
          </li>
          <li>
            <a
              href="https://trase.finance/"
              className={cx('sites-menu-link', { active: activeCard === 1 })}
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
              className={cx('sites-menu-link', { active: activeCard === 2 })}
              onMouseOver={() => setActiveCard(2)}
              onFocus={() => setActiveCard(2)}
              onMouseLeave={() => setActiveCard(null)}
            >
              Insights
            </a>
          </li>
        </ul>
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
                  cardsRef={cardsRef}
                  id={item.key}
                  active={activeCard === item.key}
                  setActiveCard={setActiveCard}
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
