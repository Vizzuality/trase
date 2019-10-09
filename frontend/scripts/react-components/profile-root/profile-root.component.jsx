import React from 'react';
import PropTypes from 'prop-types';
import ProfileSearchLegacy from 'react-components/profile-root/profile-search-legacy.container';
import ProfileSearch from 'react-components/profile-root/profile-search.container';
import ProfileSelector from 'react-components/shared/profile-selector';
import ContextSelector from 'react-components/shared/context-selector/context-selector.container';
import ErrorMessage from 'react-components/profile-root/error-message/error-message.component';
import cx from 'classnames';
import Img from 'react-components/shared/img';
import Button from 'react-components/shared/button';
import SliderSection from 'react-components/home/slider-section/slider-section.component';

import 'scripts/react-components/profile-root/profile-root.scss';

const renderLegacyProfiles = props => {
  const { errorMessage, activeContext, selectContexts } = props;
  return (
    <div className="l-profile-root-legacy">
      {!errorMessage && (
        <div className="c-profile-root-legacy">
          <div className="row column">
            <div className="profile-root-search-container row align-center">
              <div className="column small-12 medium-9 large-6">
                <div className="profile-root-heading-container">
                  <div className="profile-root-heading-wrapper">
                    <ContextSelector
                      selectContexts={selectContexts}
                      selectedContext={activeContext}
                      className={cx('profile-root-context-selector', {
                        '-readonly': DISABLE_MULTIPLE_CONTEXT_PROFILES
                      })}
                    />
                  </div>
                </div>
                <ProfileSearchLegacy
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
                <Img
                  className="profile-root-mock hide-for-small"
                  src="/images/backgrounds/profile-mock.jpg"
                  alt="Profile Page Example"
                />
                <Img
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

renderLegacyProfiles.propTypes = {
  errorMessage: PropTypes.string,
  activeContext: PropTypes.object,
  selectContexts: PropTypes.func.isRequired
};

const ProfileRoot = props => {
  const nodeTypeRenderer = node => {
    const { contexts } = props;
    const context = contexts.find(c => c.id === node.contextId);
    if (!context) return node.nodeType;
    return `${node.nodeType} - ${context.commodityName} - ${context.countryName}`;
  };

  const getResultTestId = item =>
    `search-result-${item.nodeType.toLowerCase()}-${item.name.toLowerCase()}`;

  if (!NEW_PROFILES_PAGE) return renderLegacyProfiles(props);
  const { topProfiles, openModal } = props;
  return (
    <div className="l-profile-root">
      <div className="c-profile-root">
        <div className="row column">
          <div className="profile-root-search-container">
            <h2 className="profile-root-description">
              Explore the trade linkages between countries, regions and traders
            </h2>
            <div className="profile-root-actions">
              <Button
                color="pink"
                icon="icon-browse"
                className="browse-button hide-for-small"
                size="rg"
                onClick={openModal}
              >
                Browse places or traders
              </Button>
              <ProfileSearch
                testId="profile-root"
                className="profile-search"
                placeholderSmall="Search"
                placeholder="Search places or traders"
                getResultTestId={getResultTestId}
                nodeTypeRenderer={nodeTypeRenderer}
              />
            </div>
            <div className="profile-root-slider">
              <SliderSection name="Featured profiles" slides={topProfiles} variant="profiles" />
            </div>
          </div>
        </div>
      </div>
      <ProfileSelector />
    </div>
  );
};

ProfileRoot.defaultProps = {
  topProfiles: []
};

ProfileRoot.propTypes = {
  topProfiles: PropTypes.array,
  contexts: PropTypes.array,
  openModal: PropTypes.func.isRequired
};

export default ProfileRoot;
