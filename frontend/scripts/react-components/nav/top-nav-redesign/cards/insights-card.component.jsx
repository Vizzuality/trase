import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Transition } from 'react-spring/renderprops';
import Heading from 'react-components/shared/heading/heading.component';
import { ImgBackground } from 'react-components/shared/img';

const InsightsCard = ({ title, summary, imageUrl, active, trailStyles }) => {
  const [cardActive, setCardActive] = useState(active);
  useEffect(() => {
    setCardActive(active);
  }, [active, setCardActive]);
  return (
    <div
      className="top-nav-card"
      style={trailStyles}
      areaLabel={title}
      onMouseOver={() => setCardActive(true)}
      onMouseLeave={() => setCardActive(false)}
      onFocus={() => {}}
    >
      <ImgBackground as="figure" alt={title} className="card-image" src={imageUrl} />
      <section className="card-contents">
        <Heading weight="bold" as="h4" variant="dm-sans" color="gray-700" size="lg">
          {title}
        </Heading>
        <Transition
          items={cardActive}
          from={{
            height: 0,
            marginTop: 0,
            marginBottom: 0,
            opacity: 0
          }}
          leave={{
            height: 0,
            marginTop: 0,
            marginBottom: 0,
            opacity: 0
          }}
          enter={{
            height: 100,
            marginTop: 10,
            marginBottom: 20,
            opacity: 1
          }}
        >
          {show =>
            show &&
            (props => (
              <div style={props} className="card-summary">
                <div className="card-summary-content">{summary}</div>
              </div>
            ))
          }
        </Transition>
      </section>
    </div>
  );
};

InsightsCard.defaultProps = {};

InsightsCard.propTypes = {
  title: PropTypes.string.isRequired,
  summary: PropTypes.string.isRequired,
  imageUrl: PropTypes.string.isRequired,
  active: PropTypes.bool.isRequired,
  trailStyles: PropTypes.object.isRequired
};

export default InsightsCard;
