import React from 'react';
import PropTypes from 'prop-types';
import Dropdown from 'react-components/shared/dropdown';
import 'react-components/shared/tags-group/tags-group.scss';

function TagsDropdown(props) {
  const { part, clearItem } = props;
  const options = part.value.map(p => ({ value: p.value, label: p.label }));
  return (
    <Dropdown
      options={options}
      onChange={value => console.log(value) || clearItem(value)}
      selectorOverrideLabel={part.value.length}
      fitContent
    />
  );
}

TagsDropdown.propTypes = {
  part: PropTypes.array.isRequired,
  clearItem: PropTypes.func.isRequired
};

export default TagsDropdown;
