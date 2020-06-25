import React from 'react';
import Heading from 'react-components/shared/heading';
import Text from 'react-components/shared/text';
import PropTypes from 'prop-types';
import capitalize from 'lodash/capitalize';
import { useTransition, animated } from 'react-spring/web.cjs';
import ResizeListener from 'react-components/shared/resize-listener.component';
import cx from 'classnames';
import isIe from 'utils/isIe';

import FeaturedCard from './featured-card.component';

import 'react-components/explore/featured-cards/featured-cards.scss';

const FeaturedCards = props => {
  const { countryName, commodityName, step, cards, openModal } = props;
  const CARDS_SIZE_MARGIN = 16; // matches featured-cards.scss

  // XXX: For IE11, we need to separate translation methods and are not allowed to use calc within them
  // We keep the calc for other browsers for performance reasons.
  const transitions = useTransition(cards, item => item.id, {
    from: item => ({
      ...(isIe()
        ? {
            transform: `translateX(${item.index * 100}%) translateX(${item.index *
              CARDS_SIZE_MARGIN}px) translateY(200px)`
          }
        : {
            transform: `translate(calc(${item.index * 100}% + ${item.index *
              CARDS_SIZE_MARGIN}px), 200px)`
          })
    }),
    enter: item => ({
      ...(isIe()
        ? {
            transform: `translateX(${item.index * 100}%) translateX(${item.index *
              CARDS_SIZE_MARGIN}px) translateY(0px)`
          }
        : {
            transform: `translate(calc(${item.index * 100}% + ${item.index *
              CARDS_SIZE_MARGIN}px), 0px)`
          })
    }),
    update: item => ({
      ...(isIe()
        ? {
            transform: `translateX(${item.index * 100}%) translateX(${item.index *
              CARDS_SIZE_MARGIN}px) translateY(0px)`
          }
        : {
            transform: `translate(calc(${item.index * 100}% + ${item.index *
              CARDS_SIZE_MARGIN}px), 0px)`
          })
    }),
    leave: item => ({
      ...(isIe()
        ? {
            transform: `translateX(${item.index * 100}%) translateX(${item.index *
              CARDS_SIZE_MARGIN}px) translateY(200px)`
          }
        : {
            transform: `translate(calc(${item.index * 100}% + ${item.index *
              CARDS_SIZE_MARGIN}px), 200px)`
          })
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

  return (
    <div className="c-featured-cards">
      <div className="row columns">
        <div className="featured-cards-heading">
          <Heading className="featured-cards-title" data-test="featured-cards-title">
            Featured {renderName(countryName)} {renderName(commodityName)} supply chains
          </Heading>
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
  commodityName: PropTypes.string,
  countryName: PropTypes.string,
  step: PropTypes.number,
  cards: PropTypes.object,
  openModal: PropTypes.func.isRequired
};

export default FeaturedCards;
