import React from 'react';
import PropTypes from 'prop-types';
import TagsGroup from 'react-components/shared/tags-group';
import Text from 'react-components/shared/text';

function DynamicSentenceWidget({ dynamicSentenceParts }) {
  if (dynamicSentenceParts) {
    return <TagsGroup readOnly color="white" tags={dynamicSentenceParts} />;
  }
  return <Text>No data available</Text>;
}

DynamicSentenceWidget.propTypes = {
  dynamicSentenceParts: PropTypes.array
};

export default DynamicSentenceWidget;
