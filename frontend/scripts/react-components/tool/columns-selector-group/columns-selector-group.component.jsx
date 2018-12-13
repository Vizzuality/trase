import React from 'react';
import PropTypes from 'prop-types';
import ColumnSelector from 'react-components/tool/column-selector/column-selector.container';

import 'react-components/tool/columns-selector-group/columns-selector-group.scss';

function ColumnsSelectorGroup({ sankeySize, columns }) {
  if (sankeySize === undefined || (columns && columns.length === 0)) {
    return null;
  }

  const styles = { width: `${sankeySize[0] + 8}px` };

  return (
    <div style={styles} className="c-columns-selector-group is-absolute">
      <ColumnSelector group={0} />
      <ColumnSelector group={1} />
      <ColumnSelector group={2} />
      <ColumnSelector group={3} />
    </div>
  );
}

ColumnsSelectorGroup.propTypes = {
  sankeySize: PropTypes.array,
  columns: PropTypes.array
};

export default ColumnsSelectorGroup;
