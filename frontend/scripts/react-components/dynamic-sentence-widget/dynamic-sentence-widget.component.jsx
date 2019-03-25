import React from 'react';
import PropTypes from 'prop-types';
import TagsGroup from 'react-components/shared/tags-group';

function DynamicSentenceWidget({ dynamicSentenceParts }) {
  return dynamicSentenceParts ? (
    <TagsGroup readOnly color="white" tags={dynamicSentenceParts} />
  ) : null;
}

DynamicSentenceWidget.propTypes = {
  dynamicSentenceParts: PropTypes.array
};

export default DynamicSentenceWidget;
