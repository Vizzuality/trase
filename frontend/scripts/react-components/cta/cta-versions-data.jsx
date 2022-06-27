import React from 'react';
import Link from 'redux-first-router-link';
import Text from 'react-components/shared/text';
import { TOOL_LAYOUT } from 'constants';

const content = text => (
  <Text weight="bold" decoration="underline" className="link-text" variant="sans" size="lg">
    {text}
  </Text>
);

const releaseNotesText = (quarter, year) => (
  <Text className="release-notes-text" variant="sans" size="lg" as="div">
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
    20222: {
      text: (
        <Text className="cta-text" variant="sans" size="lg">
          {' '}
          We released updated sub-national level data for{' '}
          {contextLink({
            text: `Argentina Soy`,
            commodityName: 'SOY',
            countryName: `ARGENTINA`
          })}
          .
        </Text>
      ),
      releaseNotesText: releaseNotesText(2, 2022)
    }
  }[version];
};

export default { getCTAData };
