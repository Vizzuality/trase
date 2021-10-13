import React from 'react';
import Link from 'redux-first-router-link';
import Text from 'react-components/shared/text';

const contextLink = (text, url, external) => {
  const content = (
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
  return external ? (
    <a href={url} target="_blank" rel="noopener noreferrer">
      {content}
    </a>
  ) : (
    <Link to={url}>{content}</Link>
  );
};

const releaseNotesText = (quarter, year) => (
  <div className="release-notes-text">
    <span>Check out our release notes </span>
    <span>
      {contextLink(
        'here',
        `https://insights.trase.earth/insights/q${quarter}-${year}-release-notes/`,
        true
      )}
    </span>
    <span>.</span>
  </div>
);

// CTA version numbers have Year-Quarter with no separators format
export const CTA_VERSIONS = {
  20213: {
    text: (
      <Text className="cta-text" variant="sans" size="lg">
        {' '}
        We released new national level data for Argentina ({contextLink('Soy')}
        {', '} {contextLink('Corn')}
        {', '}
        {contextLink('Cotton')}
        {', '} {contextLink('Wood Pulp')}
        {'), '}
        {contextLink('Bolivian Soy')}
        {', and  '}
        {contextLink('Indonesian Shrimp')}.
      </Text>
    ),
    releaseNotesText: releaseNotesText(3, 2021)
  }
};

export default { CTA_VERSIONS };
