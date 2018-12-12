import React from 'react';
import PropTypes from 'prop-types';
import ProfileSearch from 'react-components/profile-root/profile-search.container';
import ContextSelector from 'react-components/shared/context-selector/context-selector.container';
import ErrorMessage from 'react-components/profile-root/error-message/error-message.component';

import 'scripts/react-components/profile-root/profile-root.scss';

const ProfileRoot = props => {
  const { errorMessage, activeContext, getContextsWithProfilePages } = props;
  return (
    <div className="l-profile-root">
      {!errorMessage && (
        <div className="c-profile-root">
          <div className="row column">
            <div className="profile-root-search-container row align-center">
              <div className="column small-12 medium-9 large-6">
                <div className="profile-root-heading-container">
                  <div className="profile-root-heading-wrapper">
                    <ContextSelector
                      selectContexts={getContextsWithProfilePages}
                      selectedContext={activeContext}
                      className="profile-root-context-selector"
                    />
                  </div>
                </div>
                <ProfileSearch
                  testId="profile-root"
                  className="profile-search"
                  resultClassName="profile-search-result"
                  placeholderSmall="Search"
                  placeholder="Search a company or production place"
                  getResultTestId={item =>
                    `search-result-${item.nodeType.toLowerCase()}-${item.name.toLowerCase()}`
                  }
                />
                <p className="profile-root-explanatory-text">
                  Enter the name of a company or production municipality, state or biome for key
                  sustainability indicators and statistics on linked traders and consumer markets.
                </p>
              </div>
            </div>
            <div className="row align-center">
              <div className="column small-12 medium-10 large-8">
                <img
                  className="profile-root-mock hide-for-small"
                  src="/images/backgrounds/profile-mock.jpg"
                  alt="Profile Page Example"
                />
                <img
                  className="profile-root-mock show-for-small"
                  src="/images/backgrounds/profile-mobile-mock.png"
                  alt="Profile Mobile Page Example"
                />
              </div>
            </div>
          </div>
        </div>
      )}
      {errorMessage && <ErrorMessage errorMessage={errorMessage} />}
    </div>
  );
};

ProfileRoot.propTypes = {
  errorMessage: PropTypes.string,
  activeContext: PropTypes.object,
  getContextsWithProfilePages: PropTypes.func.isRequired
};

export default ProfileRoot;
