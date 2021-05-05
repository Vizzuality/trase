import React from 'react';
import PropTypes from 'prop-types';
import { Transition } from 'react-spring/renderprops';
import Heading from 'react-components/shared/heading/heading.component';
import { ImgBackground } from 'react-components/shared/img';

const InsightsCard = ({
  title,
  url,
  summary,
  imageUrl,
  setActiveCard,
  active,
  trailStyles,
  id
}) => {
  return (
    <a
      className="top-nav-card"
      style={trailStyles}
      areaLabel={title}
      href={url}
      onMouseOver={() => setActiveCard(id)}
      onMouseLeave={() => setActiveCard(false)}
      onFocus={() => {}}
    >
      <ImgBackground as="figure" alt={title} className="card-image" src={imageUrl} />
      <section className="card-contents">
        <Heading weight="bold" as="h4" variant="dm-sans" color="gray-700" size="lg">
          {title}
        </Heading>
        <Transition
          items={active}
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
            height: 120,
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
    </a>
  );
};

InsightsCard.defaultProps = {};

InsightsCard.propTypes = {
  title: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  id: PropTypes.bool.isRequired,
  summary: PropTypes.string.isRequired,
  imageUrl: PropTypes.string.isRequired,
  active: PropTypes.bool.isRequired,
  setActiveCard: PropTypes.func.isRequired,
  trailStyles: PropTypes.object.isRequired
};

export default InsightsCard;
