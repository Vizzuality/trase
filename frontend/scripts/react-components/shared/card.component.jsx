import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

function Card(props) {
  const { linkUrl, subtitle, title, imageUrl, actionName, className, translateUrl } = props;
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
      <a
        className="card-link"
        href={linkUrl}
        target="_blank"
        rel="noopener noreferrer"
        tx-content={cx({ translate_urls: translateUrl })}
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
      </a>
      <figcaption className="card-content">
        <div className="card-details-container">
          <h4 className="subtitle">{subtitle}</h4>
          <p className="card-title">{title}</p>
        </div>
        <a
          className="card-action subtitle -gray"
          target="_blank"
          rel="noopener noreferrer"
          href={linkUrl}
          tx-content={cx({ translate_urls: translateUrl })}
        >
          {actionName}
        </a>
      </figcaption>
    </div>
  );
}

Card.propTypes = {
  className: PropTypes.string,
  translateUrl: PropTypes.bool,
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
  imageUrl: PropTypes.string.isRequired,
  linkUrl: PropTypes.string.isRequired,
  actionName: PropTypes.string.isRequired
};

export default Card;
