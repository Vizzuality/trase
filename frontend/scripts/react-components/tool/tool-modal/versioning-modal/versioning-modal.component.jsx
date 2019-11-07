import React, { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Heading from 'react-components/shared/heading';
import Text from 'react-components/shared/text';
import Button from 'react-components/shared/button';
import Table from 'react-components/shared/table-modal/table';
import 'react-components/tool/tool-modal/versioning-modal/versioning-modal.scss';
import useWindowSize from 'utils/hooks/useWindowSize';
import capitalize from 'lodash/capitalize';

function VersioningModal({ data, context, tableData }) {
  const { title, version, summary, link } = data;
  const { countryName, commodityName } = context;
  const summaryElement = useRef(null);
  const [tableHeight, setTableHeight] = useState(null);
  const size = useWindowSize();
  useEffect(() => {
    if (summaryElement.current) {
      const summaryHeight = summaryElement.current.offsetHeight;
      const HEADING_HEIGHTS = 113;
      const PADDING = 30;
      const MODAL_FOOTER_HEIGHT = 86;
      const TABLE_HEADER_HEIGHT = 40;
      setTableHeight(
        window.innerHeight * 0.9 -
          summaryHeight -
          HEADING_HEIGHTS -
          PADDING -
          MODAL_FOOTER_HEIGHT -
          TABLE_HEADER_HEIGHT
      );
    }
  }, [summary, summaryElement, size.height]);

  return (
    <div className="c-versioning-modal">
      <div className="row columns">
        <div className="versioning-modal-content">
          <Heading size="md" className="modal-title">
            {title} Data version {version} {capitalize(countryName)} {capitalize(commodityName)}
          </Heading>
          <Heading as="h4" weight="bold" className="summary-title">
            Key Facts
          </Heading>
          <div ref={summaryElement} className="summary-text">
            <Text lineHeight="lg" color="grey-faded">
              {summary}
            </Text>
          </div>
          {tableData && (
            <Table
              width={750}
              height={tableHeight}
              data={tableData.data}
              headers={tableData.headers}
            />
          )}
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
  tableData: PropTypes.object,
  context: PropTypes.object
};

export default VersioningModal;
