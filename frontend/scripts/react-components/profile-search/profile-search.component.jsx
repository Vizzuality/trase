import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

const ProfileSearch = (props) => {
  const { nodes, errorMessage } = props;

  return (
    <div className={classnames(
      'l-profiles',
      { '-error': nodes.length === 0 && errorMessage !== null }
    )}
    >
      {nodes.length === 0 && errorMessage !== null &&
      <div className="js-loading">
        <div className="profiles-veil" />
        <div className="c-spinner" />
      </div>
      }
      <div className="wrap">
        <div className={classnames(
          'container',
          { 'is-hidden': errorMessage !== null }
        )}
        >
          <div className="search-container">
            <div className="c-search js-search">
              <label htmlFor="search-input">Search for</label>
              <input
                className="search-input js-search-input"
                id="search-input"
                placeholder="trader or production place"
              />
              <svg className="icon icon-search">
                <use xlinkHref="#icon-search" />
              </svg>
            </div>
          </div>
          <div className="explanatory-text">
            <p className="paragraph -center"><strong>Enter the name of a company</strong> for statistics on its links
              with source municipalities
              (including top-line sustainability indicators) and consumer markets.
            </p>
            <p className="paragraph -center">
              <strong>Enter the name of a production municipality, state or biome</strong> for key sustainability
              indicators and statistics on linked traders and consumer markets.
            </p>
          </div>
        </div>
        {errorMessage === null &&
        <div className="c-error-message">
          <p className="message">{errorMessage}</p>
        </div>
        }
      </div>
    </div>
  );
};

ProfileSearch.propTypes = {
  errorMessage: PropTypes.string,
  nodes: PropTypes.array.isRequired
};

export default ProfileSearch;
