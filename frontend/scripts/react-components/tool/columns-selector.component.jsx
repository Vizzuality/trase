import React from 'react';
import ColumnSelector from 'containers/tool/column-selector-react.container';
import 'styles/components/tool/columns-selector.scss';
import PropTypes from 'prop-types';

export default function columnsSelector({ sankeySize, columns }) {
  if (sankeySize === undefined || columns === undefined) {
    return null;
  }

  const styles = { width: `${sankeySize[0] + 8}px` };

  return (
    <div style={styles} className="c-columns-selector is-absolute" >
      <ColumnSelector group={0} />
      <ColumnSelector group={1} />
      <ColumnSelector group={2} />
      <ColumnSelector group={3} />
    </div >
  );
}

columnsSelector.propTypes = {
  sankeySize: PropTypes.array,
  columns: PropTypes.array
};
