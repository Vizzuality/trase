import React, { useState, useEffect } from 'react';
import Heading from 'react-components/shared/heading';
import Text from 'react-components/shared/text';
import PropTypes from 'prop-types';
import capitalize from 'lodash/capitalize';
import upperCase from 'lodash/upperCase';
import pluralize from 'utils/pluralize';
import { useTransition, animated } from 'react-spring';

import 'react-components/explore/top-cards/top-cards.scss';

const TopCard = ({ card, openModal }) => {
  const { countryName, indicatorName, commodityName, nodeTypeName } = card;
  if (!card.countryName) return null;
  return (
    <button
      onClick={() => openModal(card)}
      className="c-top-card"
      data-test={`top-card-${countryName}-${commodityName}-${nodeTypeName}-${indicatorName}`}
    >
      <Text
        variant="mono"
        align="center"
        weight="bold"
        size="lg"
        transform="uppercase"
        color="grey-faded"
      >
        {countryName} · {commodityName}
      </Text>
      <Text variant="mono" align="center" transform="uppercase" color="grey-faded" lineHeight="lg">
        {nodeTypeName && `Top 10 ${pluralize(nodeTypeName)}`}
      </Text>
      <Text variant="mono" align="center" transform="uppercase" color="grey-faded">
        {indicatorName && upperCase(indicatorName)}
      </Text>
    </button>
  );
};

TopCard.propTypes = {
  card: PropTypes.object.isRequired,
  openModal: PropTypes.func.isRequired
};

const TopCards = ({
  setCommodity,
  setCountry,
  countryName,
  commodityName,
  step,
  cards,
  openModal
}) => {
  const [animatedItems, setAnimatedItems] = useState([]);
  const transitions = useTransition(animatedItems, item => item.key, {
    from: { transform: 'translateY(200px)' },
    enter: { transform: 'translateY(0px)' },
    leave: { display: 'none' }
  });

  useEffect(() => {
    setAnimatedItems(cards[step]);
  }, [cards, step]);

  const renderName = name => (
    <Text as="span" size="lg" weight="bold">
      {capitalize(name)}
    </Text>
  );
  const renderCards = () =>
    transitions.map(
      ({ item, props, key }) =>
        item && (
          <div className="columns small-3">
            <animated.div key={key} style={props} className="animated-card">
              <TopCard key={item.key} card={item} openModal={openModal} />
            </animated.div>
          </div>
        )
    );

  const clearStep = step === 2 ? () => setCountry(null) : () => setCommodity(null);
  return (
    <div className="c-top-cards">
      <div className="row columns">
        <div className="top-cards-heading">
          <Heading className="top-cards-title" data-test="top-cards-title">
            Top {renderName(countryName)} {renderName(commodityName)} supply chains
          </Heading>
          {step > 0 && (
            <button onClick={clearStep} className="back-button" data-test="top-cards-back-button">
              <Text variant="mono" size="rg" weight="bold">
                BACK
              </Text>
            </button>
          )}
        </div>
      </div>
      <div className="top-cards-container">
        <div className="row" data-test="top-cards-row">
          {cards && renderCards()}
        </div>
      </div>
    </div>
  );
};

TopCards.propTypes = {
  setCommodity: PropTypes.func.isRequired,
  commodityName: PropTypes.string,
  countryName: PropTypes.string,
  setCountry: PropTypes.func.isRequired,
  step: PropTypes.number,
  cards: PropTypes.object,
  openModal: PropTypes.func.isRequired
};

export default TopCards;
