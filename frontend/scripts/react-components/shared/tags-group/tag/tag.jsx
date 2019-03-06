import React from 'react';
import PropTypes from 'prop-types';
import TagComponent from 'react-components/shared/tags-group/tag/tag.component';
import { DASHBOARD_STEPS } from 'constants';

class TagContainer extends React.Component {
  static propTypes = {
    clearPanel: PropTypes.func,
    removeSentenceItem: PropTypes.func,
    readOnly: PropTypes.bool,
    step: PropTypes.number,
    part: PropTypes.object
  };

  isPartReadOnly = () => {
    const { readOnly, step, part } = this.props;
    return readOnly ? true : step > DASHBOARD_STEPS[part.id.toUpperCase()];
  };

  getOptions = () => {
    const { value } = this.props.part;
    const readOnly = this.isPartReadOnly();
    const iconProp = readOnly ? {} : { icon: 'close' };
    const options = value.map(p => ({ value: p.id, label: p.name, ...iconProp }));
    return readOnly
      ? options
      : options.concat({ label: 'CLEAR ALL', value: 'clear-all', ...iconProp });
  };

  removeOption = optionToClear => {
    const { removeSentenceItem, clearPanel, part } = this.props;
    if (optionToClear.value === 'clear-all') {
      if (part.panel === 'companies') removeSentenceItem(part.value, part.panel);
      else clearPanel(part.panel);
    } else {
      removeSentenceItem(part.value.find(v => v.id === optionToClear.value), part.panel);
    }
  };

  clearSingleItem = () => {
    const { removeSentenceItem, clearPanel, part } = this.props;
    if (part.panel === 'companies') {
      removeSentenceItem(part.value[0], part.panel);
    } else clearPanel(part.panel);
  };

  render() {
    return (
      <TagComponent
        {...this.props}
        removeOption={this.removeOption}
        clearSingleItem={this.clearSingleItem}
        options={this.getOptions()}
        isPartReadOnly={this.isPartReadOnly()}
      />
    );
  }
}

TagContainer.defaultProps = {
  readOnly: false
};

export default TagContainer;
