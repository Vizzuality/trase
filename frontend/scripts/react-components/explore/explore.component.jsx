import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Heading from 'react-components/shared/heading';
import GridListItem from 'react-components/shared/grid-list-item/grid-list-item.component';
import PropTypes from 'prop-types';
import TopCards from 'react-components/explore/top-cards';
import Text from 'react-components/shared/text';
import WorldMap from 'react-components/shared/world-map/world-map.container';
import uniq from 'lodash/uniq';
import last from 'lodash/last';
import { EXPLORE_STEPS } from 'constants';
import getTopNodesKey from 'utils/getTopNodesKey';
import cx from 'classnames';
import Responsive from 'react-components/shared/responsive.hoc';

import 'react-components/explore/explore.scss';

const ResponsiveWorldMap = Responsive({ debounceRate: 350 })(WorldMap);

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
  topNodes,
  getTopCountries,
  commodityContexts,
  quickFactsIndicators
}) {
  const [highlightedContext, setHighlightedContext] = useState(null);
  const [highlightedCountryIds, setHighlightedCountries] = useState(null);
  const [highlightedCommodityIds, setHighlightedCommodities] = useState(null);

  const highlightedContextKey =
    highlightedContext &&
    getTopNodesKey(
      highlightedContext.id,
      'country',
      last(highlightedContext.years),
      last(highlightedContext.years)
    );

  // Clear highlighted items on step change
  useEffect(() => {
    setHighlightedCommodities(null);
    if (step !== EXPLORE_STEPS.selected) setHighlightedContext(null);
  }, [step]);

  // Show highlighted context if we come back from the tool
  useEffect(() => {
    if (step === EXPLORE_STEPS.selected)
      setHighlightedContext(
        contexts.find(c => c.countryId === country.id && c.commodityId === commodity.id)
      );
  }, [commodity, contexts, country, step]);

  // Get top destination countries
  useEffect(() => {
    if (step === EXPLORE_STEPS.selectCountry)
      getTopCountries(commodityContexts, { fromDefaultYear: true });
  }, [commodityContexts, getTopCountries, step]);

  const renderTitle = () => {
    const titleParts = ['commodity', 'sourcing country', 'supply chain'];
    return (
      <Heading size="lg" align="center">
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

  const findContextCountries = useCallback(
    commodityId =>
      !commodityId
        ? null
        : uniq(contexts.filter(c => c.commodityId === commodityId).map(c => c.countryId)),
    [contexts]
  );

  const onItemHover = item => {
    if (step === EXPLORE_STEPS.selectCommodity) {
      return setHighlightedCountries(findContextCountries(item?.id));
    }
    const findContext = countryId =>
      countryId
        ? contexts.find(c => c.countryId === countryId && c.commodityId === commodity.id)
        : null;

    return setHighlightedContext(findContext(item?.id));
  };

  const setItemFunction = step === EXPLORE_STEPS.selectCommodity ? setCommodity : setCountry;

  const destinationCountries = highlightedContextKey && topNodes[highlightedContextKey];
  const getHighlightedCountryIds = useMemo(() => {
    switch (step) {
      case EXPLORE_STEPS.selectCommodity:
        return {
          level1: allCountriesIds,
          level2: highlightedCountryIds
        };
      case EXPLORE_STEPS.selectCountry:
        return destinationCountries
          ? null
          : {
              level1: findContextCountries(commodity.id)
            };
      default:
        return null;
    }
  }, [
    allCountriesIds,
    commodity,
    destinationCountries,
    findContextCountries,
    highlightedCountryIds,
    step
  ]);
  const ITEMS_PER_ROW = 7;
  const rowsNumber = items.length && Math.ceil(items.length / ITEMS_PER_ROW);
  return (
    <div className="c-explore">
      <div className="explore-selector">
        {renderTitle()}
        <div className="explore-grid-container">
          <div className="row columns">
            <div className={cx('explore-grid', { [`rows${rowsNumber}`]: rowsNumber })}>
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
        </div>
        <div className={cx('map-section', { [`rows${rowsNumber}`]: rowsNumber })}>
          <div className="row">
            <div className="small-8 columns">
              <div className={cx('map-container', { [`rows${rowsNumber}`]: rowsNumber })}>
                <ResponsiveWorldMap
                  center={[0, 0]}
                  context={highlightedContext}
                  destinationCountries={destinationCountries}
                  highlightedCountryIds={getHighlightedCountryIds}
                  onHoverGeometry={geoId =>
                    setHighlightedCommodities(findHighlightedCommoditiesIds(geoId))
                  }
                />
              </div>
            </div>
            <div className="small-4 columns">
              <div className="quick-facts">
                {quickFactsIndicators.map(indicator => (
                  <div className="bubble">
                    <Text size="rg" align="center" variant="mono">
                      {indicator.name}
                    </Text>
                    <Text size="lg" weight="regular" align="center" className="quick-facts-value">
                      {indicator.value} {indicator.unit}
                    </Text>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
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
  topNodes: PropTypes.object,
  commodityContexts: PropTypes.array,
  getTopCountries: PropTypes.func.isRequired,
  quickFactsIndicators: PropTypes.object
};

export default Explore;
