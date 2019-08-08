import React from 'react';
import Heading from 'react-components/shared/heading';
import Text from 'react-components/shared/text';
import PropTypes from 'prop-types';
import capitalize from 'lodash/capitalize';

import 'react-components/tool-selector/top-cards/top-cards.scss';

const TopCards = ({ setCommodity, setCountry, countryName, commodityName, step }) => {
  const renderName = name => (
    <Text as="span" size="lg" weight="bold">
      {capitalize(name)}
    </Text>
  );
  const clearStep = step === 2 ? () => setCountry(null) : () => setCommodity(null);
  return (
    <div className="c-top-cards">
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
