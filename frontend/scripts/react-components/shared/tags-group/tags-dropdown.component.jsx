import React from 'react';
import PropTypes from 'prop-types';
import Dropdown from 'react-components/shared/dropdown';
import 'react-components/shared/tags-group/tags-group.scss';

function TagsDropdown(props) {
  const { part, removeSentenceItem, clearPanel } = props;
  const options = part.value
    .map(p => ({ value: p.id, label: p.name }))
    .concat({ label: 'CLEAR ALL', value: 'clear-all' });
  const removeOption = optionToClear => {
    if (optionToClear.value === 'clear-all') {
      if (part.panel === 'companies') removeSentenceItem(part.value, part.panel);
      else clearPanel(part.panel);
    } else {
      removeSentenceItem(part.value.find(v => v.id === optionToClear.value), part.panel);
    }
  };

  return (
    <Dropdown
      className="c-tags-dropdown"
      options={options}
      onChange={removeOption}
      selectorOverrideLabel={`${part.value.length} ${part.panel}`}
      fitContent
      showSelected
    />
  );
}

TagsDropdown.propTypes = {
  part: PropTypes.object.isRequired,
  removeSentenceItem: PropTypes.func.isRequired,
  clearPanel: PropTypes.func.isRequired
};

export default TagsDropdown;
