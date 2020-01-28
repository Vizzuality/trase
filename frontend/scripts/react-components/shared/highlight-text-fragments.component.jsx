import React from 'react';
import { findAll } from 'highlight-words-core';
import Text from 'react-components/shared/text';

function HighlightTextFragments({ text, highlight }) {
  return findAll({
    searchWords: [highlight],
    textToHighlight: text
  }).map(chunk => {
    const segmentStr = text.substr(chunk.start, chunk.end - chunk.start);
    return chunk.highlight ? (
      <Text as="mark" key={`marked_${segmentStr}_${text}_${chunk.start}`} variant="mono">
        {segmentStr}
      </Text>
    ) : (
      <Text as="span" key={`clean${segmentStr}_${text}_${chunk.start}`} variant="mono">
        {segmentStr}
      </Text>
    );
  });
}

export default HighlightTextFragments;
