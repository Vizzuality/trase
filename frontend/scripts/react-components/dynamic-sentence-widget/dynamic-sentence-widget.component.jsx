import React from 'react';
import PropTypes from 'prop-types';
import TagsGroup from 'react-components/shared/tags-group';
import Text from 'react-components/shared/text';

function DynamicSentenceWidget({ dynamicSentenceParts }) {
  return dynamicSentenceParts ? (
    <TagsGroup readOnly color="white" tags={dynamicSentenceParts} />
  ) : (
    <Text>No data available</Text>
  );
}

DynamicSentenceWidget.propTypes = {
  dynamicSentenceParts: PropTypes.array
};

export default DynamicSentenceWidget;
