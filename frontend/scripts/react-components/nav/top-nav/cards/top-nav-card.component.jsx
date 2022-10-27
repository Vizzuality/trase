import React from 'react';
import PropTypes from 'prop-types';
import { Transition } from 'react-spring/renderprops';
import Heading from 'react-components/shared/heading/heading.component';
import { ImgBackground } from 'react-components/shared/img';
import Text from 'react-components/shared/text';
import cx from 'classnames';

const TopNavCard = ({
  title,
  url,
  summary,
  imageUrl,
  setActiveCard,
  inactive,
  active,
  id,
  cardsRef
}) => (
  <a
    className={cx('top-nav-card', { active, inactive })}
    aria-label={title}
    href={url}
    onMouseOver={() => setActiveCard(id)}
    onMouseLeave={() => setActiveCard(false)}
    onFocus={() => {}}
    ref={reference => {
      cardsRef.current[id] = reference;
    }}
  >
    <ImgBackground as="figure" alt={title} className="card-image" src={imageUrl} />
    <section className="card-contents">
      <Heading weight="bold" as="h4" variant="sans" color="gray-700" size="xlg">
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
              <Text variant="sans" size="rg" className="card-summary-content" lineHeight="md">
                {summary}
              </Text>
            </div>
          ))
        }
      </Transition>
    </section>
  </a>
);

TopNavCard.defaultProps = {};

TopNavCard.propTypes = {
  title: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  id: PropTypes.number.isRequired,
  summary: PropTypes.string.isRequired,
  imageUrl: PropTypes.string.isRequired,
  inactive: PropTypes.string,
  cardsRef: PropTypes.string,
  active: PropTypes.bool.isRequired,
  setActiveCard: PropTypes.func.isRequired
};

export default TopNavCard;
