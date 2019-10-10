import React from 'react';
import PropTypes from 'prop-types';
import ProfileSearch from 'react-components/profile-root/profile-search.container';
import ProfileSelector from 'react-components/shared/profile-selector';
import Button from 'react-components/shared/button';
import SliderSection from 'react-components/home/slider-section/slider-section.component';

import 'scripts/react-components/profile-root/profile-root.scss';

const ProfileRoot = props => {
  const nodeTypeRenderer = node => {
    const { contexts } = props;
    const context = contexts.find(c => c.id === node.contextId);
    if (!context) return node.nodeType;
    return `${node.nodeType} - ${context.commodityName} - ${context.countryName}`;
  };

  const getResultTestId = item =>
    `search-result-${item.nodeType.toLowerCase()}-${item.name.toLowerCase()}`;

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
