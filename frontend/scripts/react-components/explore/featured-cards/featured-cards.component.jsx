import React from 'react';
import Heading from 'react-components/shared/heading';
import Text from 'react-components/shared/text';
import PropTypes from 'prop-types';
import capitalize from 'lodash/capitalize';
import { EXPLORE_STEPS } from 'constants';
import { useTransition, animated } from 'react-spring';
import ResizeListener from 'react-components/shared/resize-listener.component';
import cx from 'classnames';

import 'react-components/explore/featured-cards/featured-cards.scss';

const FeaturedCard = ({ card, openModal, step }) => {
  const { title, subtitle, countryName, commodityName } = card;
  const stepIds = { 1: '', 2: `-${commodityName}`, 3: `-${commodityName}-${countryName}` };
  const cardStepId = stepIds[step];
  return (
    <div className="c-featured-card">
      <button
        onClick={() => openModal(card)}
        className="featured-card-button"
        data-test={`featured-card${cardStepId}`}
      >
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
        <Text
          variant="mono"
          align="center"
          transform="uppercase"
          color="grey-faded"
          lineHeight="lg"
          className="featured-card-text"
          title={title}
        >
          {title}
        </Text>
        <Text
          variant="mono"
          align="center"
          transform="uppercase"
          color="grey-faded"
          className="featured-card-text"
          title={subtitle}
        >
          {subtitle}
        </Text>
      </button>
    </div>
  );
};

FeaturedCard.propTypes = {
  step: PropTypes.number,
  card: PropTypes.object.isRequired,
  openModal: PropTypes.func.isRequired
};

const FeaturedCards = props => {
  const {
    setCommodity,
    setCountry,
    countryName,
    commodityName,
    step,
    cards,
    isMobile,
    openModal
  } = props;
  const CARDS_SIZE_MARGIN = 16; // matches featured-cards.scss

  const transitions = useTransition(cards, item => item.id, {
    from: item => ({
      transform: `translate(calc(${item.index * 100}% + ${item.index *
        CARDS_SIZE_MARGIN}px), 200px)`
    }),
    enter: item => ({
      transform: `translate(calc(${item.index * 100}% + ${item.index * CARDS_SIZE_MARGIN}px), 0px)`
    }),
    update: item => ({
      transform: `translate(calc(${item.index * 100}% + ${item.index * CARDS_SIZE_MARGIN}px), 0px)`
    }),
    leave: item => ({
      transform: `translate(calc(${item.index * 100}% + ${item.index *
        CARDS_SIZE_MARGIN}px), 200px)`
    }),
    unique: true
  });

  const renderName = name => (
    <Text as="span" size="lg" weight="bold">
      {capitalize(name)}
    </Text>
  );

  const renderCards = isSmall =>
    transitions.map(transition => (
      <animated.div
        key={transition.key}
        style={!isSmall ? transition.props : undefined}
        className={cx({ 'mobile-card': isSmall, 'desktop-card': !isSmall })}
      >
        <FeaturedCard
          step={step}
          key={transition.key}
          card={transition.item}
          openModal={openModal}
        />
      </animated.div>
    ));

  const clearStep =
    step === EXPLORE_STEPS.selected ? () => setCountry(null) : () => setCommodity(null);
  return (
    <div className="c-featured-cards">
      <div className="row columns">
        <div className="featured-cards-heading">
          <Heading className="featured-cards-title" data-test="featured-cards-title">
            Featured {renderName(countryName)} {renderName(commodityName)} supply chains
          </Heading>
          {step > EXPLORE_STEPS.selectCommodity && !isMobile && (
            <button
              onClick={clearStep}
              className="back-button"
              data-test="featured-cards-back-button"
            >
              <Text variant="mono" size="rg" weight="bold">
                BACK
              </Text>
            </button>
          )}
        </div>
      </div>
      <ResizeListener>
        {({ resolution }) => (
          <div
            className={cx('featured-cards-container', {
              '-mobile': resolution.isSmall
            })}
            data-test={cx({
              'featured-cards-row-mobile': resolution.isSmall,
              'featured-cards-row': !resolution.isSmall
            })}
          >
            {resolution.isSmall ? (
              renderCards(resolution.isSmall)
            ) : (
              <div className="row column animated-cards-container">
                {renderCards(resolution.isSmall)}
              </div>
            )}
          </div>
        )}
      </ResizeListener>
    </div>
  );
};

FeaturedCards.propTypes = {
  setCommodity: PropTypes.func.isRequired,
  commodityName: PropTypes.string,
  countryName: PropTypes.string,
  setCountry: PropTypes.func.isRequired,
  step: PropTypes.number,
  cards: PropTypes.object,
  isMobile: PropTypes.bool,
  openModal: PropTypes.func.isRequired
};

export default FeaturedCards;
