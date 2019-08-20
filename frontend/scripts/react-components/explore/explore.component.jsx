import React, { useState, useEffect } from 'react';
import Heading from 'react-components/shared/heading';
import GridListItem from 'react-components/shared/grid-list-item/grid-list-item.component';
import PropTypes from 'prop-types';
import TopCards from 'react-components/explore/top-cards';
import WorldMap from 'react-components/shared/world-map/world-map.container';
import uniq from 'lodash/uniq';
import { EXPLORE_STEPS } from 'constants';
import 'react-components/explore/explore.scss';

function Explore({
  items,
  step,
  setCommodity,
  setCountry,
  commodity,
  country,
  contexts,
  allCountriesIds,
  cards,
  goToTool,
  editing
}) {
  if (!editing) goToTool();

  const [highlightedContext, setHighlightedContext] = useState(null);
  const [highlightedSelectableCountryIds, setHighlightedSelectableCountries] = useState(
    allCountriesIds
  );
  const [highlightedCountryIds, setHighlightedCountries] = useState(null);
  const [highlightedCommodityIds, setHighlightedCommodities] = useState(null);

  // Set highlighted countries
  useEffect(() => {
    setHighlightedSelectableCountries(allCountriesIds);
  }, [allCountriesIds]);

  // Clear highlighted items on step change
  useEffect(() => {
    setHighlightedCommodities(null);
    if (step !== EXPLORE_STEPS.selected) setHighlightedContext(null);
  }, [step]);

  const renderTitle = () => {
    const titleParts = ['commodity', 'sourcing country', 'supply chain'];
    return (
      <Heading size="lg" align="center" className="tool-selector-title">
        {step + 1}. Choose one {titleParts[step]}
      </Heading>
    );
  };

  const findHighlightedCommoditiesIds = geoId => {
    const highlightedCommoditiesIds = [];
    contexts.forEach(c => {
      if (c.worldMap.geoId === geoId) {
        highlightedCommoditiesIds.push(c.commodityId);
      }
    });
    return uniq(highlightedCommoditiesIds);
  };

  const onItemHover = item => {
    if (step === EXPLORE_STEPS.selectCommodity) {
      const findContextCountries = commodityId =>
        !commodityId
          ? null
          : uniq(contexts.filter(c => c.commodityId === commodityId).map(c => c.countryId));

      return setHighlightedCountries(findContextCountries(item?.id));
    }
    const findContext = countryId =>
      countryId
        ? contexts.find(c => c.countryId === countryId && c.commodityId === commodity.id)
        : null;

    return setHighlightedContext(findContext(item?.id));
  };

  const setItemFunction = step === EXPLORE_STEPS.selectCommodity ? setCommodity : setCountry;
  return (
    <div className="c-tool-selector">
      <div className="row columns">{renderTitle()}</div>
      <div className="row columns">
        <div className="tool-selector-grid">
          {step < EXPLORE_STEPS.selected &&
            items.map(item => (
              <GridListItem
                item={item}
                enableItem={i => setItemFunction(i.id)}
                onHover={onItemHover}
                variant="white"
                isActive={highlightedCommodityIds && highlightedCommodityIds.includes(item.id)}
              />
            ))}
        </div>
      </div>
      <div className="row columns">
        <WorldMap
          highlightedContext={highlightedContext}
          highlightedCountryIds={
            step === EXPLORE_STEPS.selectCommodity && {
              level1: highlightedSelectableCountryIds,
              level2: highlightedCountryIds
            }
          }
          onHoverGeometry={geoId => setHighlightedCommodities(findHighlightedCommoditiesIds(geoId))}
        />
      </div>
      <TopCards
        step={step}
        setCommodity={setCommodity}
        setCountry={setCountry}
        commodityName={commodity?.name}
        countryName={country?.name}
        cards={cards}
        goToTool={goToTool}
      />
    </div>
  );
}

Explore.propTypes = {
  items: PropTypes.shape({
    name: PropTypes.string.isRequired
  }),
  commodity: PropTypes.object,
  country: PropTypes.object,
  contexts: PropTypes.array,
  allCountriesIds: PropTypes.array,
  setCommodity: PropTypes.func.isRequired,
  setCountry: PropTypes.func.isRequired,
  cards: PropTypes.object.isRequired,
  goToTool: PropTypes.func.isRequired,
  step: PropTypes.number,
  editing: PropTypes.bool
};

export default Explore;
