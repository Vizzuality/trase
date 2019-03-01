import React from 'react';
import PropTypes from 'prop-types';
import TagsGroupComponent from 'react-components/shared/tags-group/tags-group.component';

class TagsGroupContainer extends React.Component {
  static propTypes = {
    clearPanel: PropTypes.func,
    removeSentenceItem: PropTypes.func,
    readOnly: PropTypes.bool
  };

  removeOption = (optionToClear, part) => {
    const { removeSentenceItem, clearPanel } = this.props;

    if (optionToClear.value === 'clear-all') {
      if (part.panel === 'companies') removeSentenceItem(part.value, part.panel);
      else clearPanel(part.panel);
    } else {
      removeSentenceItem(part.value.find(v => v.id === optionToClear.value), part.panel);
    }
  };

  getOptions = values => {
    const { readOnly } = this.props;
    const iconProp = readOnly ? {} : { icon: 'close' };
    const options = values.map(p => ({ value: p.id, label: p.name, ...iconProp }));
    return readOnly
      ? options
      : options.concat({ label: 'CLEAR ALL', value: 'clear-all', ...iconProp });
  };

  clearSingleItem = part => {
    const { removeSentenceItem, clearPanel } = this.props;
    if (part.panel === 'companies') {
      removeSentenceItem(part.value[0], part.panel);
    } else clearPanel(part.panel);
  };

  render() {
    return (
      <TagsGroupComponent
        {...this.props}
        removeOption={this.removeOption}
        clearSingleItem={this.clearSingleItem}
        getOptions={this.getOptions}
      />
    );
  }
}

TagsGroupContainer.defaultProps = {
  readOnly: false
};

export default TagsGroupContainer;
