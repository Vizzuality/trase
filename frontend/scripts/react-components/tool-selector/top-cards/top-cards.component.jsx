import React from 'react';
import Heading from 'react-components/shared/heading';
import Text from 'react-components/shared/text';
import PropTypes from 'prop-types';
import capitalize from 'lodash/capitalize';

import 'react-components/tool-selector/top-cards/top-cards.scss';

const TopCard = ({ card }) => {
  const { country, parts, commodity } = card;
  return (
    <button className="c-top-card">
      <Text
        variant="mono"
        align="center"
        weight="bold"
        size="lg"
        transform="uppercase"
        color="grey-faded"
        className="top-card-title"
      >
        {country} · {commodity}
      </Text>
      <Text variant="mono" align="center" transform="uppercase" color="grey-faded">
        Top {parts}
      </Text>
    </button>
  );
};

TopCard.propTypes = {
  card: PropTypes.object.isRequired
};

const cards = [
  { country: 'Brazil', commodity: 'Soy', parts: '10 municipalities' },
  { country: 'Brazil', commodity: 'Soy', parts: '10 municipalities' },
  { country: 'Brazil', commodity: 'Soy', parts: '10 municipalities' }
];

const TopCards = ({ setCommodity, setCountry, countryName, commodityName, step }) => {
  const renderName = name => (
    <Text as="span" size="lg" weight="bold">
      {capitalize(name)}
    </Text>
  );
  const clearStep = step === 2 ? () => setCountry(null) : () => setCommodity(null);
  return (
    <div className="c-top-cards">
      <div className="row columns">
        <div className="top-cards-heading">
          <Heading className="top-cards-title">
            Top {renderName(countryName)} {renderName(commodityName)} supply chains
          </Heading>
          {step > 0 && (
            <button onClick={clearStep} className="back-button">
              <Text variant="mono" size="rg" weight="bold">
                BACK
              </Text>
            </button>
          )}
        </div>
      </div>
      <div className="top-cards-container">
        <div className="row columns">
          <div className="top-cards-row">
            {cards.map(card => (
              <TopCard key={`${card.country}-${card.commodity}`} card={card} />
            ))}
          </div>
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
  step: PropTypes.number
};

export default TopCards;
