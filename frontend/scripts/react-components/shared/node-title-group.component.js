import { h } from 'preact';
import cx from 'classnames';

import 'styles/components/tool/nodesTitles.scss';
import NodeTitle from 'react-components/shared/node-title.component';

export default function NodeTitleGroup({ nodes = [], onClose }) {
  return (
    <div class={cx('c-nodes-titles')}>
      {
        nodes.map(node => (
          <NodeTitle {...node} onClose={() => onClose(node.id)} />
        ))
      }
    </div>
  );
}