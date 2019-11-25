import React from 'react';
import PropTypes from 'prop-types';
import TagsGroup from 'react-components/shared/tags-group';
import Text from 'react-components/shared/text';

function DynamicSentenceWidget({ dynamicSentenceParts, variant }) {
  const color = {
    dark: 'white',
    light: 'grey'
  }[variant];
  if (dynamicSentenceParts) {
    return <TagsGroup readOnly color={color} tags={dynamicSentenceParts} />;
  }
  return <Text>No data available</Text>;
}

DynamicSentenceWidget.propTypes = {
  variant: PropTypes.string,
  dynamicSentenceParts: PropTypes.array
};

export default DynamicSentenceWidget;
