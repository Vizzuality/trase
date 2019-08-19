import React, { useState, useEffect } from 'react';
import Heading from 'react-components/shared/heading';
import GridListItem from 'react-components/shared/grid-list-item/grid-list-item.component';
import PropTypes from 'prop-types';
import TopCards from 'react-components/tool-selector/top-cards';
import WorldMap from 'react-components/shared/world-map/world-map.container';
import uniq from 'lodash/uniq';
import { TOOL_SELECTOR_STEPS } from 'constants';
import 'react-components/tool-selector/tool-selector.scss';

function ToolSelector({
  items,
  step,
  setCommodity,
  setCountry,
  commodity,
  country,
  contexts,
  allCountriesIds
}) {
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
    if (step !== TOOL_SELECTOR_STEPS.selected) setHighlightedContext(null);
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
    if (step === TOOL_SELECTOR_STEPS.selectCommodity) {
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

  const setItemFunction = step === TOOL_SELECTOR_STEPS.selectCommodity ? setCommodity : setCountry;
  return (
    <div className="c-tool-selector">
      <div className="row columns">{renderTitle()}</div>
      <div className="row columns">
        <div className="grid-list">
          {step < TOOL_SELECTOR_STEPS.selected &&
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
          toolSelector
          highlightedContext={highlightedContext}
          highlightedCountryIds={
            step === TOOL_SELECTOR_STEPS.selectCommodity && {
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
      />
    </div>
  );
}

ToolSelector.propTypes = {
  items: PropTypes.shape({
    name: PropTypes.string.isRequired
  }),
  commodity: PropTypes.object,
  country: PropTypes.object,
  contexts: PropTypes.array,
  allCountriesIds: PropTypes.array,
  setCommodity: PropTypes.func.isRequired,
  setCountry: PropTypes.func.isRequired,
  step: PropTypes.number
};

export default ToolSelector;
