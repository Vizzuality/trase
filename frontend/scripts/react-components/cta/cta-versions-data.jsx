import React from 'react';
import Link from 'redux-first-router-link';
import Text from 'react-components/shared/text';
import { TOOL_LAYOUT } from 'constants';

const content = text => (
  <Text
    weight="bold"
    decoration="underline"
    className="link-text"
    restyled
    variant="sans"
    size="lg"
  >
    {text}
  </Text>
);

const releaseNotesText = (quarter, year) => (
  <Text className="release-notes-text" restyled variant="sans" size="lg">
    <span>Check out our release notes </span>
    <span>
      <a
        href={`https://insights.trase.earth/insights/q${quarter}-${year}-release-notes/`}
        target="_blank"
        rel="noopener noreferrer"
      >
        {content('here')}
      </a>
    </span>
    <span>.</span>
  </Text>
);

// CTA version numbers have Year-Quarter with no separators format
export const getCTAData = (version, contexts) => {
  if (!contexts) return null;

  const contextLink = ({ text, commodityName, countryName }) => {
    const context = contexts.find(
      c =>
        c.commodityName === commodityName.toUpperCase() &&
        c.countryName === countryName.toUpperCase()
    );
    const to = context && {
      type: 'tool',
      payload: {
        serializerParams: {
          toolLayout: TOOL_LAYOUT.splitted,
          countries: context.countryId,
          commodities: context.commodityId
        }
      }
    };

    return <Link to={context && to}>{content(text)}</Link>;
  };

  return {
    20213: {
      text: (
        <Text className="cta-text" variant="sans" size="lg">
          {' '}
          We released new national level data for Argentina (
          {contextLink({ text: 'Soy', commodityName: 'SOY', countryName: 'ARGENTINA' })}
          {', '} {contextLink({ text: 'Corn', commodityName: 'CORN', countryName: 'ARGENTINA' })}
          {', '}
          {contextLink({
            text: 'Cotton',
            commodityName: 'COTTON',
            countryName: 'ARGENTINA'
          })}
          {', '}{' '}
          {contextLink({
            text: 'Wood Pulp',
            commodityName: 'WOOD PULP',
            countryName: 'ARGENTINA'
          })}
          {'), '}
          {contextLink({
            text: 'Bolivian Soy',
            commodityName: 'SOY',
            countryName: 'BOLIVIA'
          })}
          {', and  '}
          {contextLink({
            text: 'Indonesian Shrimp',
            commodityName: 'SHRIMP',
            countryName: 'INDONESIA'
          })}
          .
        </Text>
      ),
      releaseNotesText: releaseNotesText(3, 2021)
    },
    20214: {
      text: (
        <Text className="cta-text" variant="sans" size="lg">
          {' '}
          We released new sub-national level data for {' '}
          {contextLink({
            text: 'Paraguay Corn ',
            commodityName: 'CORN',
            countryName: 'PARAGUAY'
          })}
          {', and  '}
          {contextLink({
            text: `Côte d'Ivoire Cocoa`,
            commodityName: 'COCOA',
            countryName: `COTE D'IVOIRE`
          })}
          .
        </Text>
      ),
      releaseNotesText: releaseNotesText(4, 2021)
    }
  }[version];
};

export default { getCTAData };
