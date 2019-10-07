import React from 'react';
import PropTypes from 'prop-types';
import Heading from 'react-components/shared/heading';
import Text from 'react-components/shared/text';
import Button from 'react-components/shared/button';
import 'react-components/tool/tool-modal/versioning-modal/versioning-modal.scss';
import capitalize from 'lodash/capitalize';

export default function VersioningModal({ data, context }) {
  const { title, version, summary, link } = data;
  const { countryName, commodityName } = context;
  return (
    <div className="c-layer-modal">
      <div className="row columns">
        <div className="layer-modal-content">
          <Heading size="md" className="modal-title">
            {title} Data version {version} {capitalize(countryName)} {capitalize(commodityName)}
          </Heading>
          <Heading as="h4" weight="bold" className="summary-title">
            Key Facts
          </Heading>
          <Text lineHeight="lg" color="grey-faded">
            {summary}
          </Text>
        </div>
      </div>
      <div className="modal-footer">
        <a rel="noopener noreferrer" target="_blank" href={link} title="download versioning pdf">
          <Button size="md" color="pink" className="link-button">
            Download PDF
          </Button>
        </a>
      </div>
    </div>
  );
}

VersioningModal.propTypes = {
  data: PropTypes.object,
  context: PropTypes.object
};
