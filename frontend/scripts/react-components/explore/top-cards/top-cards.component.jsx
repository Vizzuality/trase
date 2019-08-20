import React from 'react';
import Heading from 'react-components/shared/heading';
import Text from 'react-components/shared/text';
import PropTypes from 'prop-types';
import capitalize from 'lodash/capitalize';
import upperCase from 'lodash/upperCase';
import pluralize from 'utils/pluralize';

import 'react-components/explore/top-cards/top-cards.scss';

const TopCard = ({ card, goToTool }) => {
  const { countryName, indicatorName, commodityName, nodeTypeName } = card;
  return (
    <button onClick={() => goToTool(card)} className="c-top-card">
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
  goToTool: PropTypes.func.isRequired
};

const TopCards = ({
  setCommodity,
  setCountry,
  countryName,
  commodityName,
  step,
  cards,
  goToTool
}) => {
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
            {cards &&
              cards[step].map(card => (
                <TopCard
                  key={`${card.country}-${card.commodity}-${card.indicatorName}-${card.nodeTypeName}`}
                  card={card}
                  goToTool={() => goToTool(card)}
                />
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
  step: PropTypes.number,
  cards: PropTypes.object,
  goToTool: PropTypes.func.isRequired
};

export default TopCards;
