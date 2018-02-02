import React from 'react';
import PropTypes from 'prop-types';
import ProfileSearch from 'react-components/profile-root/profile-search.container';

const ProfileRoot = (props) => {
  const { errorMessage } = props;
  return (
    <div className="l-profile-root">
      {!errorMessage &&
        <div className="c-profile-root">
          <div className="row column">
            <div className="profile-root-search-container row align-center">
              <div className="column small-6">
                <div className="profile-root-heading-container">
                  <div className="profile-root-heading-wrapper">
                    <h2 className="subtitle -gray">Country & Commodity</h2>
                    <h1 className="title">Brazil &ndash; Soy</h1>
                  </div>
                </div>
                <ProfileSearch />
                <p className="profile-root-explanatory-text">
                  Enter the name of a company or production municipality, state or biome for key
                  sustainability indicators and statistics on linked traders and consumer markets.
                </p>
              </div>
            </div>
            <div className="row align-center">
              <div className="column small-8">
                <img
                  className="profile-root-mock"
                  src="/images/backgrounds/profile-mock.jpg"
                  alt="Profile Page Example"
                />
              </div>
            </div>
          </div>
        </div>
      }
      {errorMessage &&
        <div className="c-error-message -absolute -charcoal">
          <p className="message">Oops! Something went wrong.</p>
          <p className="message">{errorMessage}</p>
        </div>
      }
    </div>
  );
};

ProfileRoot.propTypes = {
  errorMessage: PropTypes.string
};

export default ProfileRoot;
