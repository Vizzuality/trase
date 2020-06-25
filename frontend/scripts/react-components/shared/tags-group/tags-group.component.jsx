import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Tag from 'react-components/shared/tags-group/tag.component';
import Heading from 'react-components/shared/heading';
import { translateText } from 'utils/transifex';

import './tags-group.scss';
import './tags-group-tooltip.variant.scss';

function TagsGroup(props) {
  const { as, variant, tags, color, showDropdown, textAs, size } = props;

  const Component = textAs || Heading;
  return React.createElement(
    as,
    { className: cx('c-tags-group', { [`v-${variant}`]: variant }) },
    <>
      {tags.map(part => (
        <Component
          as="span"
          size={size}
          align="center"
          key={part.id || part.prefix}
          color={color}
          className="tag-group-part notranslate"
        >
          {part.prefix && translateText(`${part.prefix} `)}
          {part.value && <Tag {...props} part={part} showDropdown={showDropdown} as={textAs} />}
        </Component>
      ))}
    </>
  );
}

TagsGroup.propTypes = {
  variant: PropTypes.string,
  color: PropTypes.string,
  size: PropTypes.string,
  showDropdown: PropTypes.bool,
  tags: PropTypes.array.isRequired,
  as: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  textAs: PropTypes.oneOfType([PropTypes.string, PropTypes.element, PropTypes.func])
};

TagsGroup.defaultProps = {
  as: 'span',
  size: 'md',
  showDropdown: true
};

export default TagsGroup;
