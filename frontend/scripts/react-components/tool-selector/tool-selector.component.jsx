import React from 'react';
import Heading from 'react-components/shared/heading';
import GridListItem from 'react-components/shared/grid-list-item/grid-list-item.component';
import PropTypes from 'prop-types';
import TopCards from 'react-components/tool-selector/top-cards';

import 'react-components/tool-selector/tool-selector.scss';

function ToolSelector({ items, step, setCommodity, setCountry, commodityName, countryName }) {
  const renderTitle = () => {
    const titleParts = ['commodity', 'sourcing country', 'supply chain'];
    return (
      <Heading size="lg" align="center" className="tool-selector-title">
        {step + 1}. Choose one {titleParts[step]}
      </Heading>
    );
  };
  const setItemFunction = step === 0 ? setCommodity : setCountry;
  return (
    <div className="c-tool-selector">
      <div className="row columns">{renderTitle()}</div>
      <div className="row columns">
        <div className="grid-list">
          {step < 2 &&
            items.map(item => (
              <GridListItem
                item={item}
                enableItem={i => setItemFunction(i.id)}
                onHover={() => {}}
                variant="white"
              />
            ))}
        </div>
      </div>
      <div className="row columns">
        <TopCards
          step={step}
          setCommodity={setCommodity}
          setCountry={setCountry}
          commodityName={commodityName}
          countryName={countryName}
        />
      </div>
    </div>
  );
}

ToolSelector.propTypes = {
  items: PropTypes.shape({
    name: PropTypes.string.isRequired
  }),
  setCommodity: PropTypes.func.isRequired,
  commodityName: PropTypes.string,
  countryName: PropTypes.string,
  setCountry: PropTypes.func.isRequired,
  step: PropTypes.number
};

export default ToolSelector;
