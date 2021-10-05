import React, { useState, useMemo, useRef, useEffect } from 'react';
import { NavLink } from 'redux-first-router-link';
import isMobile from 'utils/isMobile';
import cx from 'classnames';
import TopNavCard from '../cards/top-nav-card.component';

const TopNavCards = () => {
  const [activeCard, setActiveCard] = useState(null);
  const mobile = useMemo(() => isMobile(), []);
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
  }, [activeCard, cardsRef, mobile]);

  const cards = [
    {
      key: 0,
      properties: {
        title: 'Supply Chains',
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
              Supply Chains
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
            <a href="https://trase.earth/resources" title="Resources page">
              Resources
            </a>
          </li>
          <li className="about-menu-item">
            <a href="https://trase.earth/about" title="About page">
              About
            </a>
          </li>
        </ul>
      </div>
      {!mobile && (
        <div className="-tab-contents">
          <div className="tab-contents-cards">
            {cards.map((card, i) => (
              <TopNavCard
                {...card.properties}
                key={card.key}
                cardsRef={cardsRef}
                id={i}
                active={activeCard === card.key}
                inactive={(activeCard || activeCard === 0) && activeCard !== card.key}
                setActiveCard={setActiveCard}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

TopNavCards.propTypes = {};

export default TopNavCards;
