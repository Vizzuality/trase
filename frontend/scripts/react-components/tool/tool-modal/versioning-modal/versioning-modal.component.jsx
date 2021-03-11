import React from 'react';
import PropTypes from 'prop-types';
import Heading from 'react-components/shared/heading';
import Text from 'react-components/shared/text';
import 'react-components/tool/tool-modal/versioning-modal/versioning-modal.scss';
import capitalize from 'lodash/capitalize';
import Link from 'redux-first-router-link';

function VersioningModal({ data, context }) {
  const { title, version, summary } = data;
  const { countryName, commodityName } = context;

  return (
    <div className="c-versioning-modal">
      <div className="row columns">
        <div className="versioning-modal-content">
          <Heading as="h3" size="lg" weight="bold" className="modal-title">
            {title}
            {version && (
              <>
                {' '}
                Data version {version} {capitalize(countryName)} {capitalize(commodityName)})
              </>
            )}
          </Heading>
          <Text
            as="div"
            size="md"
            lineHeight="lg"
            dangerouslySetInnerHTML={{ __html: summary }}
            className="summary"
          />
          <div>
            <Text size="md" as="span">
              Do you want to learn more? Explore{' '}
            </Text>
            <Link to="/about/methods-and-data" title="Methods and data">
              <Text as="span" className="link-text" size="md" weight="bold" decoration="underline">
                Methods and data.
              </Text>
            </Link>
          </div>
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
