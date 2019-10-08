import { useState, useEffect, useMemo } from 'react';
import { EXPLORE_STEPS } from 'constants';
import uniq from 'lodash/uniq';

export function useTopDestinationCountries({ commodityContexts, step, getTopCountries }) {
  // Get top destination countries
  useEffect(() => {
    if (step === EXPLORE_STEPS.selectCountry) {
      getTopCountries(commodityContexts, { fromDefaultYear: true });
    }
  }, [commodityContexts, getTopCountries, step]);
}

export function useClearExploreOnUnmount({ setCommodity, setCountry }) {
  useEffect(
    () => () => {
      setCommodity(null);
      setCountry(null);
    },
    [setCountry, setCommodity]
  );
}

export function useQuickFacts({ step, getQuickFacts, commodity }) {
  // Get quick facts
  useEffect(() => {
    if (step === EXPLORE_STEPS.selectCountry) {
      getQuickFacts(commodity.id);
    }
  }, [commodity, getQuickFacts, step]);
}

export function useSankeyCards({ step, getSankeyCards, commodity, country }) {
  // Get quick facts
  useEffect(() => {
    getSankeyCards(step, commodity, country);
  }, [commodity, country, getSankeyCards, step]);
}

export function useHighlightedCommodities({ contexts }) {
  const [hoveredGeometry, setHoveredGeometry] = useState(null);

  const highligtedCommodities = useMemo(() => {
    const highlighted = [];
    contexts.forEach(c => {
      if (c.worldMap.geoId === hoveredGeometry) {
        highlighted.push(c.commodityId);
      }
    });
    return uniq(highlighted);
  }, [contexts, hoveredGeometry]);

  return [highligtedCommodities, setHoveredGeometry];
}

export function useHighlightedContext({ commodity, contexts, step, country }) {
  const [hoveredCountry, setHoveredCountry] = useState(null);

  // clear hovered on step change
  useEffect(() => () => setHoveredCountry(null), [step, setHoveredCountry]);

  const highlightedContext = useMemo(() => {
    const activeCountry = hoveredCountry || country?.id;
    if (!activeCountry || !commodity) {
      return null;
    }
    return contexts.find(c => c.countryId === activeCountry && c.commodityId === commodity.id);
  }, [commodity, contexts, hoveredCountry, country]);

  return [highlightedContext, setHoveredCountry];
}

export function useHighlightedCountries(
  { step, commodity, allCountriesIds, contexts },
  destinationCountries
) {
  const [hoveredCommodity, setHoveredCommodity] = useState(null);

  // clear hovered on step change
  useEffect(() => () => setHoveredCommodity(null), [step, setHoveredCommodity]);

  const highlightedCountries = useMemo(() => {
    switch (step) {
      case EXPLORE_STEPS.selectCommodity:
        return {
          level1: allCountriesIds,
          level2: uniq(
            contexts.filter(c => c.commodityId === hoveredCommodity).map(c => c.countryId)
          )
        };
      case EXPLORE_STEPS.selectCountry: {
        if (destinationCountries || !commodity) {
          return null;
        }
        const destinationIds = destinationCountries?.map(c => c.id);
        return {
          level1: uniq(
            destinationIds ||
              contexts.filter(c => c.commodityId === commodity.id).map(c => c.countryId)
          )
        };
      }
      default:
        return null;
    }
  }, [step, hoveredCommodity, contexts, allCountriesIds, commodity, destinationCountries]);

  return [highlightedCountries, setHoveredCommodity];
}
