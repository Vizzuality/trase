import React, { useState } from 'react';
import Heading from 'react-components/shared/heading';
import GridListItem from 'react-components/shared/grid-list-item/grid-list-item.component';
import PropTypes from 'prop-types';
import FeaturedCards from 'react-components/explore/featured-cards';
import Text from 'react-components/shared/text';
import WorldMap from 'react-components/shared/world-map/world-map.container';
import { EXPLORE_STEPS, BREAKPOINTS } from 'constants';
import cx from 'classnames';
import Dropdown from 'react-components/shared/dropdown';
import ResizeListener from 'react-components/shared/resize-listener.component';
import { format } from 'd3-format';
import SimpleModal from 'react-components/shared/simple-modal/simple-modal.component';
import addApostrophe from 'utils/addApostrophe';
import { translateText } from 'utils/transifex';
import {
  useTopDestinationCountries,
  useClearExploreOnUnmount,
  useQuickFacts,
  useSankeyCards,
  useHighlightedCommodities,
  useHighlightedContext,
  useHighlightedCountries
} from 'react-components/explore/explore.hooks';

import 'react-components/explore/explore.scss';

const ToolLinksModal = React.lazy(() => import('./tool-links-modal'));

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
  const [activeCard, setActiveCard] = useState(null);

  useTopDestinationCountries(props);
  useClearExploreOnUnmount(props);
  useQuickFacts(props);
  useSankeyCards(props);

  const [
    highlightedCommodityIds,
    highlightedCommoditiesCountryName,
    setHoveredGeometry
  ] = useHighlightedCommodities(props);
  const [highlightedContext, setHoveredCountry] = useHighlightedContext(props);
  const destinationCountries = highlightedContext?.id && topNodes[highlightedContext.id];
  const [highlightedCountryIds, setHoveredCommodity] = useHighlightedCountries(props);

  const openModal = card => {
    setModalOpen(true);
    setActiveCard(card);
  };

  const closeModal = () => {
    setModalOpen(false);
    setActiveCard(null);
  };

  const renderTitle = () => {
    const titleParts = ['commodity', 'source country', 'supply chain to explore'];
    return (
      <Heading size="lg" align="center" data-test="step-title" className="notranslate">
        {translateText(`${step}. Choose a ${titleParts[step - 1]}`)}
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
        variant="bordered"
        selectedValueOverride={commodity ? undefined : `Commodity (${commodities.length})`}
        options={commodities.map(i => ({ value: i.id, label: i.name }))}
        value={commodity && { value: commodity.id, label: commodity.name }}
        onChange={i => (commodity ? resetCommodity(i.value) : setCommodity(i.value))}
      />
      {commodity && (
        <div className="country-dropdown-container">
          <Dropdown
            size="rg"
            variant="bordered"
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
                              color="transparent"
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
                                <Text
                                  size="rg"
                                  align="center"
                                  variant="mono"
                                  weight="bold"
                                  transform="uppercase"
                                  className="quick-facts-label notranslate"
                                >
                                  {translateText(`${indicator.name} ${indicator.year}`)}
                                </Text>
                                <Heading
                                  size="md"
                                  weight="bold"
                                  align="center"
                                  className="quick-facts-value notranslate"
                                >
                                  {translateText(
                                    `${format(',')(Math.round(indicator.total))} ${indicator.unit}`
                                  )}
                                </Heading>
                              </div>
                            ))
                          ) : (
                            <div className="bubble">
                              {(highlightedCountryIds.level1.length > 0 ||
                                highlightedCountryIds.level2.length > 0 ||
                                highlightedCommodityIds.length > 0) && (
                                <>
                                  <Text
                                    size="rg"
                                    align="center"
                                    variant="mono"
                                    weight="bold"
                                    transform="uppercase"
                                    className="quick-facts-label notranslate"
                                  >
                                    {translateText(
                                      highlightedCommodityIds.length > 0
                                        ? `${highlightedCommoditiesCountryName}${addApostrophe(
                                            highlightedCommoditiesCountryName
                                          )} commodities`
                                        : 'source countries'
                                    )}
                                  </Text>
                                  <Heading
                                    size="md"
                                    weight="bold"
                                    align="center"
                                    className="quick-facts-value notranslate"
                                  >
                                    {translateText(
                                      highlightedCommodityIds.length ||
                                        highlightedCountryIds.level2?.length ||
                                        highlightedCountryIds.level1.length
                                    )}
                                  </Heading>
                                </>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <FeaturedCards
                step={step}
                setCommodity={setCommodity}
                setCountry={setCountry}
                commodityName={commodity?.name}
                countryName={country?.name}
                cards={cards}
                openModal={params => (isMobile ? goToTool('dashboard', params) : openModal(params))}
                isMobile={isMobile}
              />
              <SimpleModal isOpen={isModalOpen} onRequestClose={() => closeModal()}>
                {isModalOpen && (
                  <ToolLinksModal goToTool={destination => goToTool(destination, activeCard)} />
                )}
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
  cards: PropTypes.array.isRequired,
  goToTool: PropTypes.func.isRequired,
  step: PropTypes.number,
  topNodes: PropTypes.object,
  commodityContexts: PropTypes.array, // eslint-disable-line
  getTopCountries: PropTypes.func.isRequired, // eslint-disable-line
  getQuickFacts: PropTypes.func.isRequired, // eslint-disable-line
  getSankeyCards: PropTypes.func.isRequired, // eslint-disable-line
  countryQuickFacts: PropTypes.object
};

export default Explore;
