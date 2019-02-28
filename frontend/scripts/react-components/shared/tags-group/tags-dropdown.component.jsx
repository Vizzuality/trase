import React from 'react';
import PropTypes from 'prop-types';
import Dropdown from 'react-components/shared/dropdown';
import 'react-components/shared/tags-group/tags-group.scss';

function TagsDropdown(props) {
  const { part, removeSentenceItem, clearPanel, theme, position } = props;
  const closeIconProp = removeSentenceItem ? { icon: 'close' } : {};
  let options = part.value.map(p => ({ value: p.id, label: p.name, ...closeIconProp }));
  if (removeSentenceItem) {
    options = options.concat({ label: 'CLEAR ALL', value: 'clear-all', ...closeIconProp });
  }
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
      theme={{
        dropdown: 'c-tags-dropdown',
        'menu-item': 'c-tags-dropdown-menu-item',
        'selected-item': 'c-tags-dropdown-selected-item',
        ...theme
      }}
      options={options}
      onChange={removeOption}
      selectedValueOverride={`${part.value.length} ${part.panel}`}
      showSelected
      fitContent
      readOnly={!removeSentenceItem}
      position={position}
    />
  );
}

TagsDropdown.propTypes = {
  part: PropTypes.object.isRequired,
  removeSentenceItem: PropTypes.func,
  clearPanel: PropTypes.func,
  theme: PropTypes.object,
  position: PropTypes.string
};

TagsDropdown.defaultProps = {
  removeSentenceItem: undefined,
  clearPanel: undefined,
  position: undefined,
  theme: {}
};

export default TagsDropdown;
