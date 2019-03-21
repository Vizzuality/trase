import React from 'react';
import DynamicSentenceComponent from 'react-components/dynamic-sentence-widget/dynamic-sentence-widget.component';
import PropTypes from 'prop-types';

class DynamicSentenceContainer extends React.PureComponent {
  static propTypes = {
    config: PropTypes.object,
    data: PropTypes.array,
    dynamicSentenceParts: PropTypes.array
  };

  addIndicatorPart = () => {
    const { data, config, dynamicSentenceParts } = this.props;
    const { yAxisLabel } = config;
    const commoditiesPart = dynamicSentenceParts.find(p => p.id === 'commodities');
    if (commoditiesPart) {
      dynamicSentenceParts.shift();
      dynamicSentenceParts.unshift({ ...commoditiesPart, prefix: 'in' });
    }
    dynamicSentenceParts.unshift({
      id: 'indicator-name',
      prefix: '',
      value: [{ name: yAxisLabel.text }]
    });
    dynamicSentenceParts.push({
      id: 'indicator-value',
      prefix: 'is',
      value: [
        {
          name: `${data[0].y0} ${yAxisLabel.suffix}`
        }
      ]
    });
    return dynamicSentenceParts;
  };

  render() {
    return React.createElement(DynamicSentenceComponent, {
      dynamicSentenceParts: this.addIndicatorPart()
    });
  }
}

export default DynamicSentenceContainer;
