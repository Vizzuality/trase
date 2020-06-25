import React from 'react';
import Text from 'react-components/shared/text';
import PropTypes from 'prop-types';
import { ImgBackground } from 'react-components/shared/img';
import cx from 'classnames';

import 'react-components/explore/featured-cards/featured-cards.scss';

const FeaturedCard = ({ card, openModal, step }) => {
  const { recentCard, title, subtitle, countryName, commodityName } = card;
  const stepIds = { 1: '', 2: `-${commodityName}`, 3: `-${commodityName}-${countryName}` };
  const cardStepId = stepIds[step];
  return (
    <div className={cx("c-featured-card", { "recent-card": recentCard })}>
      <ImgBackground
        as="button"
        onClick={() => openModal(card)}
        className="featured-card-button"
        data-test={`featured-card${cardStepId}`}
        src={`'/images/featured-links/${countryName}.svg'`}
      >
        {!recentCard && <Text
          variant="mono"
          align="center"
          weight="bold"
          size="lg"
          transform="uppercase"
          color="white"
        >
          <span className="featured-card-country-name">{countryName}</span>
          <span className="featured-card-commodity-name">{commodityName}</span>
        </Text>}
        <Text
          variant="mono"
          align="center"
          weight="bold"
          transform="uppercase"
          color="white"
          lineHeight={recentCard ? "md" : "lg"}
          size={recentCard ? "md" : "rg"}
          className="featured-card-text"
          title={title}
        >
          {title}
        </Text>
        <Text
          variant="mono"
          align="center"
          transform="uppercase"
          color="white"
          weight="bold"
          className="featured-card-text"
          title={subtitle}
        >
          {subtitle}
        </Text>
      </ImgBackground>
    </div>
  );
};

FeaturedCard.propTypes = {
  step: PropTypes.number,
  card: PropTypes.object.isRequired,
  openModal: PropTypes.func.isRequired
};

export default FeaturedCard;