import React from 'react';
import DynamicSentenceComponent from 'react-components/dynamic-sentence-widget/dynamic-sentence-widget.component';
import { addIndicatorsPartToSentence } from 'react-components/dynamic-sentence-widget/dynamic-sentence-widget.selectors';

export default props =>
  React.createElement(DynamicSentenceComponent, {
    dynamicSentenceParts: addIndicatorsPartToSentence(props)
  });
