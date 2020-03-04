import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import Text from 'react-components/shared/text';

import './toolbar-tooltip.scss';
import TagsGroup from 'react-components/shared/tags-group/tags-group.component';

function ToolbarTooltip(props) {
  const { hidden, scheduleUpdate, style, innerRef, placement, children } = props;

  useEffect(() => {
    scheduleUpdate();
  }, [hidden, scheduleUpdate]);

  return (
    <div
      ref={innerRef}
      className="c-toolbar-tooltip"
      style={style}
      data-placement={placement}
      hidden={hidden}
    >
      {typeof children === 'string' && (
        <Text lineHeight="md" color="white" size="sm">
          {children}
        </Text>
      )}
      {Array.isArray(children) && (
        <TagsGroup
          variant="tooltip"
          readOnly
          tags={children}
          color="white"
          textAs={Text}
          size="sm"
          showDropdown={false}
        />
      )}
    </div>
  );
}

ToolbarTooltip.propTypes = {
  hidden: PropTypes.bool,
  placement: PropTypes.string,
  scheduleUpdate: PropTypes.func,
  style: PropTypes.object,
  innerRef: PropTypes.any,
  children: PropTypes.any
};

export default ToolbarTooltip;
