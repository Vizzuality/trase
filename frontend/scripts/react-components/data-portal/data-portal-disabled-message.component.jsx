import React from 'react';
import Text from 'react-components/shared/text';

const DataPortalDisabledMessage = () => (
  <div className="c-data-portal-disabled-message">
    <div className="veil -below-nav" />
    <div className="c-modal -below-nav">
      <div className="disabled-message-content">
        <Text as="p" color="white" size="md" variant="serif" weight="light" lineHeight="lg">
          Thank you for your interest in downloading data from trase.earth! Trase is committed to
          making the data available on the platform publicly available for anyone to access and use.
          The data portal is currently deactivated whilst we put some finishing touches to its
          development. We plan to make the new and extended trase data available to all users soon.
        </Text>
      </div>
    </div>
  </div>
);

export default DataPortalDisabledMessage;
