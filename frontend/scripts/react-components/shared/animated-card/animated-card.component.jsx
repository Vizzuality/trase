import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Heading from 'react-components/shared/heading/heading.component';
import Text from 'react-components/shared/text/text.component';
import { ImgBackground } from 'react-components/shared/img';

import 'react-components/shared/animated-card/animated-card.scss';

function AnimatedCard(props) {
  const {
    linkUrl,
    title,
    subtitle,
    category,
    imageUrl,
    className,
    translateUrl,
    Link,
    linkProps,
    testId,
    parseHtml
  } = props;
  return (
    <div className={cx('c-animated-card', className)} data-test={testId}>
      <Link
        className="card-link"
        href={linkUrl}
        target="_blank"
        rel="noopener noreferrer"
        tx-content={translateUrl ? 'translate_urls' : undefined}
        {...linkProps}
      >
        <ImgBackground as="figure" alt={title} className="card-image" src={imageUrl} />
        <figcaption className="card-content">
          <div className="card-details-container">
            <Heading as="h4" variant="mono" color="pink" size="sm" weight="bold">
              {category}
            </Heading>
            <Heading as="h3" color="grey" size="lg" weight="bold">
              {title}
            </Heading>
            <div className="cards-details-text-container">
              <Text
                as="span"
                color="grey"
                size="md"
                weight="light"
                transform="capitalize"
                className="card-title"
                lineHeight="lg"
              >
                {parseHtml ? <div dangerouslySetInnerHTML={{ __html: subtitle }} /> : subtitle}
              </Text>
            </div>
          </div>
        </figcaption>
      </Link>
    </div>
  );
}

AnimatedCard.defaultProps = {
  Link: 'a'
};

AnimatedCard.propTypes = {
  Link: PropTypes.any,
  linkUrl: PropTypes.string,
  imageUrl: PropTypes.string,
  linkProps: PropTypes.object,
  className: PropTypes.string,
  translateUrl: PropTypes.bool,
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
  category: PropTypes.string.isRequired,
  testId: PropTypes.string,
  parseHtml: PropTypes.bool
};

export default AnimatedCard;
