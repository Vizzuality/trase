import React from 'react';
import PropTypes from 'prop-types';
import TagsGroup from 'react-components/shared/tags-group';
import Text from 'react-components/shared/text';

function NodeIndicatorSentenceWidget({ nodeIndicatorSentenceParts, variant }) {
  const color = {
    dark: 'white',
    light: 'grey'
  }[variant];
  if (nodeIndicatorSentenceParts) {
    return <TagsGroup readOnly color={color} tags={nodeIndicatorSentenceParts} />;
  }
  return <Text>No data available</Text>;
}

NodeIndicatorSentenceWidget.propTypes = {
  variant: PropTypes.string,
  nodeIndicatorSentenceParts: PropTypes.array
};

export default NodeIndicatorSentenceWidget;
