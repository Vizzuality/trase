/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import PropTypes from 'prop-types';
import Link from 'redux-first-router-link';
import Img from 'react-components/shared/img';
import Heading from 'react-components/shared/heading';
import Text from 'react-components/shared/text';
import Icon from 'react-components/shared/icon';
import { TOOL_LAYOUT } from 'constants';

import './button-links.scss';

const links = [
  {
    heading: 'DATA',
    section: 'data-view',
    subtitle: 'GO TO DATA VIEW',
    img: '',
    layout: TOOL_LAYOUT.right
  },
  {
    heading: 'LOCATION IMPACT',
    subtitle: 'GO TO MAP',
    img: '/images/profiles/profile-main-option-2.svg',
    layout: TOOL_LAYOUT.left
  },
  {
    heading: 'CONNECTIONS',
    subtitle: 'GO TO SUPPLY CHAIN',
    img: '/images/profiles/profile-main-option-3.svg',
    layout: TOOL_LAYOUT.right
  }
];
function ButtonLinks(props) {
  const { year, nodeId, countryId, commodityId, nodeType, name } = props;
  return (
    <div className="c-button-links">
      <div className="row button-links-row">
        {links.map(link => (
          <div className="columns small-12 medium-4 link-container">
            <Link
              className="link-button"
              to={{
                type: 'tool',
                payload: {
                  section: link.section,
                  serializerParams: {
                    countries: countryId,
                    commodities: commodityId,
                    selectedNodesIds: [nodeId],
                    selectedYears: [year, year],
                    toolLayout: link.layout,
                    __temporaryExpandedNodes: [{ id: nodeId, nodeType, name }]
                  }
                }
              }}
            >
              <div>
                <Heading weight="bold" as="h4" variant="mono" size="rg">
                  {link.heading}
                </Heading>
                <div className="link-text">
                  <Text variant="mono" color="grey-faded" size="md" as="span">
                    {link.subtitle}
                  </Text>
                  <Icon icon="icon-external-link" color="elephant" />
                </div>
              </div>
              <Img title={link.subtitle} src={link.img} />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

ButtonLinks.propTypes = {
  name: PropTypes.string.isRequired,
  countryId: PropTypes.number.isRequired,
  commodityId: PropTypes.number.isRequired,
  nodeType: PropTypes.string.isRequired,
  year: PropTypes.number.isRequired,
  nodeId: PropTypes.number.isRequired
};

export default ButtonLinks;
