import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import ProfileSearchBox from 'react-components/profile-root/profile-search-box.container';

const ProfileRoot = props => {
  const { nodes, errorMessage } = props;
  const hasNodes = nodes.length > 0;
  return (
    <div className="l-profile-root">
      <div className={classnames('c-profile-root', { '-error': !hasNodes && errorMessage })}>
        {hasNodes &&
          errorMessage && (
            <React.Fragment>
              <div className="profiles-veil" />
              <div className="c-spinner" />
            </React.Fragment>
          )}
        <div className={classnames('container', { 'is-hidden': errorMessage })}>
          <div className="search-container">
            <ProfileSearchBox />
          </div>
          <div className="explanatory-text">
            <p className="paragraph -center">
              <strong>Enter the name of a company</strong> for statistics on its links with source
              municipalities (including top-line sustainability indicators) and consumer markets.
            </p>
            <p className="paragraph -center">
              <strong>Enter the name of a production municipality, state or biome</strong> for key
              sustainability indicators and statistics on linked traders and consumer markets.
            </p>
          </div>
        </div>
        {errorMessage && (
          <div className="c-error-message">
            <p className="message">{errorMessage}</p>
          </div>
        )}
      </div>
    </div>
  );
};

ProfileRoot.propTypes = {
  errorMessage: PropTypes.string,
  nodes: PropTypes.array.isRequired
};

export default ProfileRoot;
