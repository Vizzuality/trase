import React from 'react';
import cx from 'classnames';

import NodeTitle from 'react-components/shared/node-title/node-title.component';
import PropTypes from 'prop-types';

import 'react-components/tool/tool-search/node-title-group/node-title-group.scss';

export default function NodeTitleGroup({ nodes = [], onClose }) {
  return (
    <div className={cx('c-node-title-group')}>
      {nodes.map(node => (
        <NodeTitle {...node} key={node.id} onClose={() => onClose(node.id)} />
      ))}
    </div>
  );
}

NodeTitleGroup.propTypes = {
  nodes: PropTypes.array,
  onClose: PropTypes.func
};
