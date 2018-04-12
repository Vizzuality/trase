import React from 'react';
import { findAll } from 'highlight-words-core';

function HighlightTextFragments({ text, highlight }) {
  return findAll({
    searchWords: [highlight],
    textToHighlight: text
  }).map(chunk => {
    const segmentStr = text.substr(chunk.start, chunk.end - chunk.start);
    return chunk.highlight ? (
      <mark key={`marked_${segmentStr}_${text}_${chunk.start}`}>{segmentStr}</mark>
    ) : (
      <span key={`clean${segmentStr}_${text}_${chunk.start}`}>{segmentStr}</span>
    );
  });
}

export default HighlightTextFragments;
