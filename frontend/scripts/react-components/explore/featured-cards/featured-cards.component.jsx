import React, { useState, useEffect } from 'react';
import Heading from 'react-components/shared/heading';
import Text from 'react-components/shared/text';
import PropTypes from 'prop-types';
import capitalize from 'lodash/capitalize';
import { EXPLORE_STEPS } from 'constants';
import { useTransition, animated } from 'react-spring';
import ResizeListener from 'react-components/shared/resize-listener.component';

import 'react-components/explore/featured-cards/featured-cards.scss';

const FeaturedCard = ({ card, openModal }) => {
  const { title, subtitle, id, commodityId, countryId } = card;
  return (
    <button
      onClick={() => openModal(card)}
      className="c-featured-card"
      data-test={`featured-card-${commodityId}-${countryId}-${id}`}
    >
      <Text
        variant="mono"
        align="center"
        weight="bold"
        size="lg"
        transform="uppercase"
        color="grey-faded"
      >
        {card.countryName} · {card.commodityName}
      </Text>
      <Text
        variant="mono"
        align="center"
        transform="uppercase"
        color="grey-faded"
        lineHeight="lg"
        className="featured-card-text"
        title={title}
      >
        {title}
      </Text>
      <Text
        variant="mono"
        align="center"
        transform="uppercase"
        color="grey-faded"
        className="featured-card-text"
        title={subtitle}
      >
        {subtitle}
      </Text>
    </button>
  );
};

FeaturedCard.propTypes = {
  card: PropTypes.object.isRequired,
  openModal: PropTypes.func.isRequired
};

const FeaturedCards = props => {
  const {
    setCommodity,
    setCountry,
    countryName,
    commodityName,
    step,
    cards,
    isMobile,
    openModal
  } = props;
  const [animatedItems, setAnimatedItems] = useState([]);
  const transitions = useTransition(animatedItems, item => item.id, {
    from: { transform: 'translateY(200px)' },
    enter: { transform: 'translateY(0px)' },
    leave: { display: 'none' }
  });

  useEffect(() => {
    setAnimatedItems(cards);
  }, [cards]);

  const renderName = name => (
    <Text as="span" size="lg" weight="bold">
      {capitalize(name)}
    </Text>
  );

  const renderCards = () =>
    transitions.map(transition => {
      if (!transition.item) return null;
      const card = (
        <animated.div key={transition.key} style={props} className="animated-card">
          <FeaturedCard key={transition.item.id} card={transition.item} openModal={openModal} />
        </animated.div>
      );
      return (
        <ResizeListener>
          {({ resolution }) =>
            resolution.isSmall ? (
              <div className="mobile-card"> {card} </div>
            ) : (
              <div className="columns small-5 medium-3"> {card} </div>
            )
          }
        </ResizeListener>
      );
    });

  const clearStep =
    step === EXPLORE_STEPS.selected ? () => setCountry(null) : () => setCommodity(null);
  return (
    <div className="c-featured-cards">
      <div className="row columns">
        <div className="featured-cards-heading">
          <Heading className="featured-cards-title" data-test="featured-cards-title">
            Featured {renderName(countryName)} {renderName(commodityName)} supply chains
          </Heading>
          {step > EXPLORE_STEPS.selectCommodity && !isMobile && (
            <button
              onClick={clearStep}
              className="back-button"
              data-test="featured-cards-back-button"
            >
              <Text variant="mono" size="rg" weight="bold">
                BACK
              </Text>
            </button>
          )}
        </div>
      </div>
      <div className="featured-cards-container">
        <ResizeListener>
          {({ resolution }) =>
            resolution.isSmall ? (
              <div className="mobile-featured-cards" data-test="featured-cards-row-mobile">
                {cards && renderCards()}
              </div>
            ) : (
              <div className="row" data-test="featured-cards-row">
                {cards && renderCards()}
              </div>
            )
          }
        </ResizeListener>
      </div>
    </div>
  );
};

FeaturedCards.propTypes = {
  setCommodity: PropTypes.func.isRequired,
  commodityName: PropTypes.string,
  countryName: PropTypes.string,
  setCountry: PropTypes.func.isRequired,
  step: PropTypes.number,
  cards: PropTypes.object,
  isMobile: PropTypes.bool,
  openModal: PropTypes.func.isRequired
};

export default FeaturedCards;
