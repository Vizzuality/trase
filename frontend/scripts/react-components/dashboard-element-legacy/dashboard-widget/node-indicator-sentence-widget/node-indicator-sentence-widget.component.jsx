import React from 'react';
import PropTypes from 'prop-types';
import TagsGroup from 'react-components/shared/tags-group';
import Text from 'react-components/shared/text';

function NodeIndicatorSentenceWidget({ nodeIndicatorSentenceParts }) {
  if (nodeIndicatorSentenceParts) {
    return <TagsGroup readOnly color="white" tags={nodeIndicatorSentenceParts} />;
  }
  return <Text>No data available</Text>;
}

NodeIndicatorSentenceWidget.propTypes = {
  nodeIndicatorSentenceParts: PropTypes.array
};

export default NodeIndicatorSentenceWidget;
