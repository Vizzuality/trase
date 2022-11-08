import React from 'react';
import PropTypes from 'prop-types';
import TagsGroupComponent from 'react-components/shared/tags-group/tags-group.component';
import { DASHBOARD_STEPS } from 'constants';

class TagsGroupContainer extends React.Component {
  static propTypes = {
    clearPanel: PropTypes.func,
    removeSentenceItem: PropTypes.func,
    readOnly: PropTypes.bool,
    step: PropTypes.number
  };

  isPartReadOnly = part => {
    const { readOnly, step } = this.props;
    return readOnly ? true : step > DASHBOARD_STEPS[part.id];
  };

  getOptions = part => {
    const { value } = part;
    const readOnly = this.isPartReadOnly(part);
    const iconProp = readOnly ? {} : { icon: 'close' };
    const options = value.map(p => ({ value: p.id, label: p.name, ...iconProp }));
    return readOnly
      ? options
      : options.concat({ label: 'CLEAR ALL', value: 'clear-all', style: { weight: 'bold' } });
  };

  removeOption = (part, optionToClear) => {
    const { removeSentenceItem, clearPanel } = this.props;

    if (optionToClear.value === 'clear-all') {
      clearPanel(part.panel);
    } else {
      removeSentenceItem(
        part.value.find(v => v.id === optionToClear.value),
        part.panel
      );
    }
  };

  clearSingleItem = part => {
    const { clearPanel } = this.props;
    clearPanel(part.panel);
  };

  render() {
    return (
      <TagsGroupComponent
        {...this.props}
        removeOption={this.removeOption}
        clearSingleItem={this.clearSingleItem}
        getOptions={this.getOptions}
        isPartReadOnly={this.isPartReadOnly}
      />
    );
  }
}

TagsGroupContainer.defaultProps = {
  readOnly: false
};

export default TagsGroupContainer;
