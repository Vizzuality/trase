import React, { useState, useEffect, useMemo } from 'react';
import Heading from 'react-components/shared/heading';
import GridListItem from 'react-components/shared/grid-list-item/grid-list-item.component';
import PropTypes from 'prop-types';
import TopCards from 'react-components/explore/top-cards';
import Text from 'react-components/shared/text';
import WorldMap from 'react-components/shared/world-map/world-map.container';
import uniq from 'lodash/uniq';
import { EXPLORE_STEPS, BREAKPOINTS } from 'constants';
import cx from 'classnames';
import Dropdown from 'react-components/shared/dropdown';
import ResizeListener from 'react-components/shared/resize-listener.component';
import { format } from 'd3-format';
import ToolLinksModal from 'react-components/explore/tool-links-modal';
import SimpleModal from 'react-components/shared/simple-modal/simple-modal.component';

import 'react-components/explore/explore.scss';

function useTopDestinationCountries({ commodityContexts, step, getTopCountries }) {
  // Get top destination countries
  useEffect(() => {
    if (step === EXPLORE_STEPS.selectCountry) {
      getTopCountries(commodityContexts, { fromDefaultYear: true });
    }
  }, [commodityContexts, getTopCountries, step]);
}

function useClearExploreOnUnmount({ setCommodity, setCountry }) {
  useEffect(
    () => () => {
      setCommodity(null);
      setCountry(null);
    },
    [setCountry, setCommodity]
  );
}

function useQuickFacts({ step, getQuickFacts, commodity }) {
  // Get quick facts
  useEffect(() => {
    if (step === EXPLORE_STEPS.selectCountry) {
      getQuickFacts(commodity.id);
    }
  }, [commodity, getQuickFacts, step]);
}

function useHighlightedCommodities({ contexts }) {
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

function useHighlightedContext({ commodity, contexts, step, country }) {
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

function useHighlightedCountries(
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

function Explore(props) {
  const {
    items,
    step,
    setCommodity,
    setCountry,
    commodity,
    country,
    cards,
    goToTool,
    topNodes,
    commodities,
    countries,
    countryQuickFacts
  } = props;
  const [isModalOpen, setModalOpen] = useState(false);
  const [linkParams, setLinkInfo] = useState(null);

  useTopDestinationCountries(props);
  useClearExploreOnUnmount(props);
  useQuickFacts(props);

  const [highlightedCommodityIds, setHoveredGeometry] = useHighlightedCommodities(props);
  const [highlightedContext, setHoveredCountry] = useHighlightedContext(props);
  const destinationCountries = highlightedContext?.id && topNodes[highlightedContext.id];
  const [highlightedCountryIds, setHoveredCommodity] = useHighlightedCountries(
    props,
    destinationCountries
  );

  const openModal = params => {
    setModalOpen(true);
    setLinkInfo(params);
  };

  const closeModal = () => {
    setModalOpen(false);
    setLinkInfo(null);
  };

  const renderTitle = () => {
    const titleParts = ['commodity', 'sourcing country', 'supply chain'];
    return (
      <Heading size="lg" align="center" data-test="step-title">
        {step}. Choose one {titleParts[step]}
      </Heading>
    );
  };

  const onItemHover = item => {
    if (item) {
      if (step === EXPLORE_STEPS.selectCommodity) {
        setHoveredCommodity(item.id);
      }

      if (step === EXPLORE_STEPS.selectCountry) {
        setHoveredCountry(item.id);
      }
    } else {
      setHoveredCommodity(null);
      setHoveredCountry(null);
    }
  };

  const setItemFunction = step === EXPLORE_STEPS.selectCommodity ? setCommodity : setCountry;
  const resetCommodity = commodityId => {
    setCountry(null);
    setCommodity(commodityId);
  };

  const quickFacts =
    countryQuickFacts &&
    (country?.id || highlightedContext?.countryId) &&
    countryQuickFacts[country?.id || highlightedContext?.countryId];

  const getRowsNumber = windowWidth => {
    const itemsPerRow = windowWidth > 880 ? 7 : 6;
    return items.length && Math.ceil(items.length / itemsPerRow);
  };

  const renderDropdowns = () => (
    <>
      <Dropdown
        size="rg"
        variant="panel"
        selectedValueOverride={commodity ? undefined : `Commodity (${commodities.length})`}
        options={commodities.map(i => ({ value: i.id, label: i.name }))}
        value={commodity && { value: commodity.id, label: commodity.name }}
        onChange={i => (commodity ? resetCommodity(i.value) : setCommodity(i.value))}
      />
      {commodity && (
        <div className="country-dropdown-container">
          <Dropdown
            size="rg"
            variant="panel"
            selectedValueOverride={country ? undefined : `Countries (${countries.length})`}
            options={countries.map(i => ({ value: i.id, label: i.name }))}
            value={country && { value: country.id, label: country.name }}
            onChange={i => setCountry(i.value)}
          />
        </div>
      )}
    </>
  );

  return (
    <div className="c-explore">
      <ResizeListener>
        {({ resolution, windowWidth, windowHeight }) => {
          const rowsNumber = getRowsNumber(windowWidth);
          const isMobileLandscape = windowHeight < windowWidth && windowHeight < BREAKPOINTS.small;
          const isMobile = resolution.isSmall || isMobileLandscape;
          return (
            <>
              <div className="explore-selector">
                {renderTitle()}
                <div className="explore-grid-container">
                  <div className="row columns">
                    {isMobile ? (
                      renderDropdowns()
                    ) : (
                      <div className={cx('explore-grid', { [`rows${rowsNumber}`]: rowsNumber })}>
                        {step < EXPLORE_STEPS.selected &&
                          items.map(item => (
                            <GridListItem
                              item={item}
                              enableItem={i => setItemFunction(i.id)}
                              onHover={onItemHover}
                              variant="white"
                              isActive={highlightedCommodityIds.includes(item.id)}
                            />
                          ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className={cx('map-section', { [`rows${rowsNumber}`]: rowsNumber })}>
                  <div className="row align-center">
                    <div className="small-12 medium-8 large-7 columns">
                      <div className={cx('map-container', { [`rows${rowsNumber}`]: rowsNumber })}>
                        <div className="map-centering">
                          <WorldMap
                            id="explore"
                            center={[0, 0]}
                            context={highlightedContext}
                            destinationCountries={destinationCountries}
                            highlightedCountryIds={highlightedCountryIds}
                            onHoverGeometry={setHoveredGeometry}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="small-4 medium-2 columns hide-for-tablet">
                      <div className="quick-facts">
                        <div className="bubble-container">
                          {quickFacts ? (
                            quickFacts.map(indicator => (
                              <div className="bubble">
                                <Text size="rg" align="center" variant="mono">
                                  {indicator.name} {indicator.year}
                                </Text>
                                <Text
                                  size="lg"
                                  weight="regular"
                                  align="center"
                                  className="quick-facts-value"
                                >
                                  {format(',')(Math.round(indicator.total))} {indicator.unit}
                                </Text>
                              </div>
                            ))
                          ) : (
                            <div className="bubble" />
                          )}
                        </div>
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
                openModal={params => (isMobile ? goToTool('dataView', params) : openModal(params))}
                isMobile={isMobile}
              />
              <SimpleModal isOpen={isModalOpen} onRequestClose={() => closeModal()}>
                <ToolLinksModal goToTool={destination => goToTool(destination, linkParams)} />
              </SimpleModal>
            </>
          );
        }}
      </ResizeListener>
    </div>
  );
}

Explore.propTypes = {
  items: PropTypes.object,
  commodities: PropTypes.array,
  countries: PropTypes.array,
  commodity: PropTypes.object,
  country: PropTypes.object,
  contexts: PropTypes.array, // eslint-disable-line
  allCountriesIds: PropTypes.array, // eslint-disable-line
  setCommodity: PropTypes.func.isRequired,
  setCountry: PropTypes.func.isRequired,
  cards: PropTypes.object.isRequired,
  goToTool: PropTypes.func.isRequired,
  step: PropTypes.number,
  topNodes: PropTypes.object,
  commodityContexts: PropTypes.array, // eslint-disable-line
  getTopCountries: PropTypes.func.isRequired, // eslint-disable-line
  getQuickFacts: PropTypes.func.isRequired, // eslint-disable-line
  countryQuickFacts: PropTypes.object
};

export default Explore;
