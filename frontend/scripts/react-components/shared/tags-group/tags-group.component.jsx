import React from 'react';
import PropTypes from 'prop-types';
import Tag from 'react-components/shared/tags-group/tag';
import Heading from 'react-components/shared/heading';
import { translateText } from 'utils/transifex';

import 'react-components/shared/tags-group/tags-group.scss';

function TagsGroup(props) {
  const { as, tags, color, suffix } = props;
  return React.createElement(
    as,
    { className: 'c-tags-group' },
    <>
      {tags.map(part => (
        <Heading
          as="span"
          size="md"
          align="center"
          key={part.id}
          color={color}
          className="tag-group-part notranslate"
        >
          {part.prefix && translateText(`${part.prefix} `)}
          {part.value && <Tag {...props} part={part} />}
        </Heading>
      ))}
      {suffix && tags.length > 0 && (
        <Heading
          as="span"
          size="md"
          align="center"
          color={color}
          className="tag-group-part notranslate"
        >
          {translateText(suffix)}
        </Heading>
      )}
    </>
  );
}

TagsGroup.propTypes = {
  color: PropTypes.string,
  tags: PropTypes.array.isRequired,
  suffix: PropTypes.string,
  as: PropTypes.oneOfType([PropTypes.string, PropTypes.element])
};

TagsGroup.defaultProps = {
  as: 'span'
};

export default TagsGroup;
