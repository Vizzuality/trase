import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

function Card(props) {
  const {
    linkUrl,
    subtitle,
    title,
    imageUrl,
    actionName,
    className,
    translateUrl,
    Link,
    linkProps
  } = props;
  return (
    <div className={cx('c-card', className)}>
      <svg
        className="card-dashed-box"
        viewBox="0 0 300 100"
        preserveAspectRatio="none"
        shapeRendering="crispEdges"
      >
        <path
          className="dashed-line"
          d="M0,0 300,0 300,100 0,100z"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <Link
        className="card-link"
        href={linkUrl}
        target="_blank"
        rel="noopener noreferrer"
        tx-content={translateUrl ? 'translate_urls' : undefined}
        {...linkProps}
      >
        <figure className="card-image" style={{ backgroundImage: `url(${imageUrl})` }} />
        <svg
          className="card-dashed-line"
          viewBox="0 0 300 100"
          preserveAspectRatio="none"
          shapeRendering="crispEdges"
        >
          <path className="dashed-line" d="M0,0 300, 0" vectorEffect="non-scaling-stroke" />
        </svg>
      </Link>
      <figcaption className="card-content">
        <div className="card-details-container">
          <h4 className="subtitle">{subtitle}</h4>
          <p className="card-title">{title}</p>
        </div>
        <Link
          className="card-action subtitle -gray"
          target="_blank"
          rel="noopener noreferrer"
          href={linkUrl}
          tx-content={translateUrl ? 'translate_urls' : undefined}
          {...linkProps}
        >
          {actionName}
        </Link>
      </figcaption>
    </div>
  );
}

Card.defaultProps = {
  Link: 'a'
};

Card.propTypes = {
  Link: PropTypes.element,
  linkUrl: PropTypes.string,
  linkProps: PropTypes.object,
  className: PropTypes.string,
  translateUrl: PropTypes.bool,
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
  imageUrl: PropTypes.string.isRequired,
  actionName: PropTypes.string.isRequired
};

export default Card;
