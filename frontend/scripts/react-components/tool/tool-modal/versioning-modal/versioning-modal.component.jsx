import React from 'react';
import PropTypes from 'prop-types';
import Heading from 'react-components/shared/heading';
import Text from 'react-components/shared/text';
import MethodsDisclaimer from 'react-components/shared/methods-disclaimer';
import 'react-components/tool/tool-modal/versioning-modal/versioning-modal.scss';
import capitalize from 'lodash/capitalize';

function VersioningModal({ data, context }) {
  const { url, version } = data || {};
  const { countryName, commodityName } = context || {};

  return (
    <div className="c-versioning-modal">
      <div className="row">
        <div className="versioning-modal-content">
          <Heading as="h3" size="md" variant="sans" weight="bold" className="modal-title">
            Methods and data
          </Heading>
          {data && (
            <>
              <Text as="span" variant="sans" size="rg" lineHeight="md" className="summary">
                {' '}
                Download the information for{' '}
                {`${countryName ? capitalize(countryName) : ''}-${
                  commodityName ? capitalize(commodityName) : ''
                }`}{' '}
                {version ? `- v.${version}` : ''}{' '}
                <a
                  title="Download version info"
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  here
                </a>
              </Text>
              <div className="divider" />
            </>
          )}
          <Text as="span" variant="sans" size="rg" lineHeight="md" className="summary">
            Trase builds on an enhanced form of material flow analysis called Spatially Explicit
            Information on Production to Consumption Systems (SEI-PCS) originally developed by{' '}
            <a
              title="Spatially Explicit Information on Production to Consumption Systems by Godar et al.2015"
              href="https://www.sciencedirect.com/science/article/abs/pii/S0921800915000427?via%3Dihub"
              target="_blank"
              rel="noopener noreferrer"
              // eslint-disable-next-line react/no-unknown-property
              tx-content="translate_urls"
            >
              Godar et al. 2015
            </a>
            . A description of all the methods and data sources currently used in Trase to apply the
            SEI-PCS approach to map subnational trade flows can be found for each of the countries
            and commodities in{' '}
            <a
              href="https://supplychains.trase.earth/about"
              target="_blank"
              rel="noopener noreferrer"
              title="Methods and data"
            >
              <Text
                as="span"
                variant="sans"
                className="link-text"
                size="rg"
                weight="bold"
                decoration="underline"
              >
                Methods and data.
              </Text>
            </a>
          </Text>
          {countryName === 'BRAZIL' && commodityName === 'SOY' && <MethodsDisclaimer />}
        </div>
      </div>
    </div>
  );
}

VersioningModal.propTypes = {
  data: PropTypes.object,
  context: PropTypes.object
};

export default VersioningModal;
